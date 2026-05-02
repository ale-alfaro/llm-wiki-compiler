---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# 🧠 Constexpr Two-Step Technique (Jason Turner)

This document walks through Jason Turner’s technique of using `constexpr` and
`consteval` to transform dynamically allocated data into static compile-time structures.
It also includes an example of adapting it for `enum class` values.

* * *

## 🧩 Core Idea

> “Allocate dynamically during compile-time, then copy into a static, fixed-size
> structure that persists in your program binary.”

* * *

## ✅ `to_span`: Dynamic to Static Transformation

```cpp
#include <array>
#include <vector>
#include <span>
#include <algorithm>
#include <iostream>

// Generic transformer: turns runtime-like allocation into a compile-time span
template<auto Func, std::size_t Capacity>
consteval auto to_span() {
    constexpr auto over_sized = [] {
        const auto result = Func();  // run-time like logic
        using Type = typename decltype(result)::value_type;

        std::array<Type, Capacity> data{};
        std::copy(result.begin(), result.end(), data.begin());
        return std::pair{data, result.size()};
    }();

    static constexpr auto right_sized = [&] {
        using Type = typename decltype(over_sized.first)::value_type;
        std::array<Type, over_sized.second> data;
        std::copy_n(over_sized.first.begin(), over_sized.second, data.begin());
        return data;
    }();

    return std::span{right_sized};
}
```

### 🔁 Usage

```cpp
int main() {
    constexpr auto span = to_span<[] {
        std::vector v{1, 2, 3, 4};
        v.push_back(42);  // dynamic growth in constexpr!
        return v;
    }, 255>();

    for (int val : span) {
        std::cout << val << ' ';
    }
}
```

🔗 [Try it on Godbolt](https://godbolt.org/z/31fc8KPoG)

* * *

## 🎨 `enum class` to `constexpr std::array`

```cpp
#include <array>
#include <type_traits>

template <typename EnumType, EnumType... Values>
consteval auto enum_to_array() {
    using Underlying = std::underlying_type_t<EnumType>;
    return std::array<Underlying, sizeof...(Values)>{ static_cast<Underlying>(Values)... };
}
```

### 📌 Usage

```cpp
enum class Color : int {
    Red = 1,
    Green = 2,
    Blue = 4
};

int main() {
    constexpr auto color_values = enum_to_array<Color, Color::Red, Color::Green, Color::Blue>();

    for (auto val : color_values) {
        std::cout << val << ' ';  // Output: 1 2 4
    }
}
```

* * *

## ✅ Summary

- Use `consteval` to force compile-time evaluation.

- Use builder functions to generate dynamic data at compile time.

- Always free or avoid heap allocations unless copied and cleaned up.

- Enum sequences can be transformed using `NTTP` expansion tricks.

* * *

* * *

## 🔁 New Example: Packed `std::string_view` Array from `std::vector<std::string>`

This example demonstrates how to:

- Use a `Builder` to generate a `std::vector<std::string>`.

- Flatten all string data into a contiguous `char` buffer.

- Create `std::string_view` instances into the packed buffer.

- All at compile-time!

```cpp
#include <vector>
#include <string>
#include <array>
#include <algorithm>
#include <iostream>
#include <ranges>

template<auto Builder, std::size_t MaxSize>
constexpr auto to_view() {
  constexpr auto data = [&]{
    const auto input = Builder();
    std::array<char, MaxSize * MaxSize> allchars{};
    std::array<std::size_t, MaxSize> string_lengths{};

    auto current = allchars.begin();
    for (std::size_t index = 0; const auto &str : input) {
      current = std::ranges::copy(str, current).out;
      string_lengths[index++] = str.size();
    }    
    const auto total_chars = std::distance(allchars.begin(), current);
    return std::tuple{input.size(), total_chars, allchars, string_lengths};
  }();

  constexpr auto total_chars = std::get<1>(data);

  static constexpr auto right_sized_chars = [&]{
    std::array<char, total_chars> result;
    auto &allchars = std::get<2>(data);
    std::ranges::copy(allchars | std::views::take(total_chars), result.begin());
    return result;
  }();

  constexpr auto num_strings = std::get<0>(data);
  std::array<std::string_view, num_strings> views;
  std::size_t start = 0;
  auto &string_lengths = std::get<3>(data);
  for (std::size_t index = 0; index < num_strings; ++index) {
    const auto size = string_lengths[index];
    views[index] = std::string_view(right_sized_chars.begin() + start,
                                    right_sized_chars.begin() + start + size);
    start += size;                                    
  }

  return views;
}

constexpr std::vector<std::string> get_strings() {
  return {"Jason", "Was", "Here"};
}

int main()
{
  constexpr auto strings = to_view<get_strings, 255>();
  for (const auto &string : strings) {
    std::cout << string << '\n';
  }
}
```

* * *

## 🧾 Modified Enum Example Using `to_view`

We now adapt the `enum class` use case by converting its names to strings:

```cpp
enum class Color : int {
    Red = 1,
    Green = 2,
    Blue = 4
};

constexpr std::vector<std::string> get_color_names() {
    return {"Red", "Green", "Blue"};
}

int main() {
    constexpr auto names = to_view<get_color_names, 64>();
    for (const auto& name : names) {
        std::cout << name << '\n';
    }
}
```

This statically creates `std::string_view` entries for the enum names and avoids runtime
overhead while preserving flexibility.

* * *

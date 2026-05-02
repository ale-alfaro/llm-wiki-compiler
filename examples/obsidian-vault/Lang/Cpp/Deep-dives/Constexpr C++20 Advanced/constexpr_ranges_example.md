---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# 🧠 Using `std::views::iota` and `std::views::transform` in `constexpr` (C++20)

`std::views::iota` and `std::views::transform` from the C++20 Ranges library can be used
in `constexpr` contexts, assuming the standard library and compiler fully support
constexpr evaluation of ranges.

* * *

## ✅ Example: Compile-Time Array Generation using `views::iota` + `views::transform`

```cpp
#include <array>
#include <ranges>
#include <algorithm>
#include <iostream>

constexpr auto generate_angles(std::size_t count) {
    std::array<double, 360> result{};  // pre-allocated large enough
    auto view = std::views::iota(0u, static_cast<unsigned>(count))
              | std::views::transform([count](unsigned i) {
                  return 360.0 / count * i;
              });

    std::ranges::copy(view, result.begin());
    return result;
}

int main() {
    constexpr auto result = generate_angles(4);

    for (size_t i = 0; i < 4; ++i) {
        std::cout << result[i] << ' ';  // Outputs: 0 90 180 270
    }
}
```

### 🔗 Compiler Explorer Link (Example)

You can try this example on [Compiler Explorer](https://godbolt.org/z/f1qEGMKzz).

* * *

## ⚠️ Requirements

- Compiler support: GCC 12+, Clang 15+, MSVC 19.30+.

- Some standard libraries might still not support all views in `constexpr` context,
  especially with `std::copy`.

* * *

## 🧠 Notes

- Use a large enough fixed array since `std::array<T, N>` requires a compile-time size.

- C++23 improves constexpr range support even further by allowing more STL algorithms in
  constexpr.

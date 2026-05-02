---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# C++20 Language Features Reference Card

© 2024 Bartlomiej Filipek\
[Original Source](https://www.cppstories.com)

* * *

## 🔑 New Keywords

`char8_t`, `co_await`, `co_return`, `co_yield`, `concept`, `consteval`, `constinit`,
`import`, `module`, `requires`

* * *

## 🧠 Concepts

```cpp
template <class T>
concept SignedIntegral = std::is_integral_v<T> && std::is_signed_v<T>;

template <SignedIntegral T>
void signedIntsOnly(T val) { }
```

* * *

## 🧩 Modules

```cpp
import helloworld;

int main() {
    hello();
}
```

* * *

## 🔁 Coroutines

```cpp
generator<int> iota(int n = 0) {
    while(true)
        co_yield n++;
}
```

* * *

## 🚦 Spaceship Operator

```cpp
auto result = a <=> b;
```

* * *

## 🧾 Designated Initializers

```cpp
struct S { int a; int b; int c; };
S test {.a = 1, .b = 10, .c = 2};
```

* * *

## 🔁 Range-Based For with Initializer

```cpp
for (int i = 0; const auto& x : get_collection()) {
    doSomething(x, i);
    ++i;
}
```

* * *

## 🔤 char8_t

UTF-8 specific character type:

```cpp
std::u8string text = u8"Hello";
```

* * *

## 🏷️ Attributes

- `[[likely]]`, `[[unlikely]]`

- `[[no_unique_address]]`

- `[[nodiscard]]` with message

* * *

## 🧵 Structured Bindings Updates

- Now supports static, thread-local, and lambda captures.

* * *

## 📦 Class Non-Type Template Parameters

```cpp
struct S { int i; };
template <S par> int foo() { return par.i + 10; }
auto result = foo<S{42}>();
```

* * *

## 👷 explicit(bool)

```cpp
explicit(!is_convertible_v<T, int>) ...
```

* * *

## 🧮 constexpr Updates

Now supports:

- `union`, `try`, `catch`, `typeid`, `virtual` functions

- `std::vector`, `std::string`

- `std::sort`, `std::rotate`, `std::reverse`

* * *

## 🧮 consteval

```cpp
consteval int add(int a, int b) { return a + b; }
constexpr int result = add(100, 300);
```

* * *

## ⏲️ constinit

Ensures compile-time initialization:

```cpp
constinit static int x = 5;
```

* * *

## 📊 Ranges

```cpp
std::ranges::sort(v);
for (auto& i : v | std::views::reverse) ...
```

* * *

## 🧾 std::format

```cpp
auto s = std::format("{:-^5}, {:-<5}", 7, 9);
```

* * *

## 🕒 Chrono/Timezone Updates

```cpp
auto now = system_clock::now();
auto cy = year_month_day{floor<days>(now)}.year();
```

* * *

## 🧵 Concurrency

- `std::jthread`, `stop_token`

- Atomics: `atomic_ref`, `shared_ptr`

- `latch`, `semaphore`, `barrier`

* * *

## 📐 std::span

```cpp
std::vector<int> vec = {1, 2, 3, 4};
std::span<int> spanVec(vec);
```

* * *

## 🔄 Other Features

- CTAD improvements

- `template-parameter-list` for lambdas

- `using enum`

- `std::bind_front`

- `std::bit_cast`, `std::lerp`, `std::midpoint`

- `std::source_location()`

- Efficient `delete`

- Feature test macros and `<version>` header

* * *

## 📚 References

- <https://isocpp.org>

- <https://www.cppstories.com>

- <https://en.cppreference.com>

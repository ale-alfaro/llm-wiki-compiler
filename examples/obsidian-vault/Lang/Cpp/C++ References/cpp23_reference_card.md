---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# C++23 Language Features Reference Card

© 2024 Bartlomiej Filipek\
[Original Source](https://www.cppstories.com)

* * *

## 🧬 Language Features

### Keywords & Directives

- `auto` — explicit cast to prvalue copy

- `this` — deducing this

- `if consteval`

- `#elifdef`, `#elifndef`, `#warning` (C23 compatibility)

### Deducing `this`

```cpp
struct Pattern {
    template <typename Self>
    void foo(this Self&& self) {
        self.fooImpl();
    }
};
```

### Init Statement with Alias Declaration

```cpp
for (using T = int; T e : container) {
    ...
}
```

### Multidimensional Subscript Operator

```cpp
struct Array2D {
    int operator[](size_t i, size_t j) {
        return m[i + j * w];
    }
};
```

### Lambda Enhancements

- Attributes on lambdas

- Omission of `()`

- `static` call operators

- Scope change for trailing return types

* * *

## 🔧 Attributes

### `[[assume]]`

```cpp
[[assume(condition)]]
```

* * *

## 🧮 `constexpr` Improvements

- Relaxed for constructors and return types

- Allows static constexpr vars

- More like regular functions

* * *

## 🔄 Temporaries in Range-Based For

```cpp
for (auto e : getVector()[0])  // lifetime of temp extended
```

* * *

## 📚 Library Features

### `std::generator`

```cpp
std::generator<int> gen = ...;  // coroutine generator
```

### Stacktrace

```cpp
std::cout << std::stacktrace::current();
```

### Scoped Enums

```cpp
std::to_underlying(EnumValue)
```

### String Enhancements

- `contains()`

- `resize_and_overwrite()`

- Avoid `nullptr` construction

* * *

## 🧰 Pointer Wrappers

### `std::out_ptr`, `std::inout_ptr`

Wraps smart pointers for C-style interop.

* * *

## 📐 Ranges and Views

- `ranges::to<>`, `starts_with`, `ends_with`

- `iota`, `shift_left/right`, `find_last(_if)`

- `contains(_subrange)`

- `ranges::fold_*`

- Views: `slide`, `zip`, `enumerate`, `stride`, `join_with`

* * *

## 🗑️ Heterogeneous Erasure

Support for `erase()` with transparent comparators.

* * *

## 🎭 Monadic Operations

### `std::optional`

```cpp
auto ret = userName
    .transform(toUpper)
    .and_then([](auto x) { ... })
    .or_else(...);
```

### `std::expected`

```cpp
std::expected<double, FuelErr> calcFuel(int dst);
```

* * *

## 📦 `flat_map` and `flat_set`

Faster alternatives to maps/sets.

* * *

## 🧮 `std::mdspan`

Multidimensional span with static/dynamic extents.

* * *

## 🖨️ Formatted Output

```cpp
std::print("{1} {0}!
", "World", "Hello");
```

* * *

## 📦 Standard Modules

```cpp
import std;
import std.compat;
```

* * *

## 📤 Spanstream

```cpp
basic_ispanstream, basic_ospanstream, basic_spanstream
```

* * *

## 🧰 Other Updates

- `if consteval {}`

- `auto(x)` / `auto{x}`

- `static operator()` / `[]`

- CTAD from inherited constructors

- Unicode updates

- `std::unreachable()`

- Pipe syntax for range adaptors

- `std::format` improvements

- `constexpr std::unique_ptr`

- `constexpr to_chars/from_chars()`

- Literal suffix: `uz`, `UZ`

* * *

## 📚 References

- <https://isocpp.org>

- <https://www.cppstories.com>

- <https://en.cppreference.com>

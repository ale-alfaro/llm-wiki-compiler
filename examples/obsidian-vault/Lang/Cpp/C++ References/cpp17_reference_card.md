---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# C++17 Language Features Reference Card

© 2019 Bartlomiej Filipek\
[Original Source](https://www.bfilipek.com)

## 🚀 New Language Features

### Auto Deduction for Braced Initialization

```cpp
auto x{1};  // deduces int
```

### Template Template Parameters

```cpp
template <typename T>
class Wrapper;

template <typename Template>
class Container;
```

### Nested Namespace Definitions

```cpp
namespace A::B::C {
    // ...
}
```

### Fold Expressions

```cpp
template<typename... Args>
auto SumAll(Args... args) {
    return (args + ...);
}
```

### Unary Fold and Empty Packs

Only valid for `&&`, `||`, `,`.

### Exception Specifications in Type System

```cpp
void foo() noexcept;  // now part of function type
```

### Guaranteed Copy Elision

```cpp
MyClass get() {
    return MyClass();  // No copy/move constructor call
}
```

### Aggregate Initialization for Base Classes

Now supported.

### Lambda Capture of `*this`

```cpp
auto lambda = [*this]() { /* copy of object */ };
```

### Memory Allocation for Over-Aligned Data

```cpp
void* operator new(std::size_t, std::align_val_t);
```

### `__has_include` Preprocessor

```cpp
#if __has_include(<optional>)
    #include <optional>
#endif
```

### Non-type Template Parameters with `auto`

```cpp
template <auto value>
void f() { }

f<10>();  // deduces int
```

### Direct-List Initialization of Enums

```cpp
enum class Handle : uint32_t { Invalid = 0 };
Handle h { 42 };  // OK
```

### Expression Evaluation Order

- Function arguments evaluated left to right

- Assignment right to left

- Shift left to right

```cpp
std::cout << f() << g(h()) << i();
```

### `constexpr` Lambdas

```cpp
constexpr auto ID = [](int n) { return n; };
static_assert(ID(3) == 3);
```

### Structured Bindings

```cpp
auto [a, b, c] = tuple;
```

### Init-Statements in If/Switch

```cpp
if (auto val = GetValue(); condition(val)) { ... }
```

### Inline Variables

```cpp
class MyClass {
    static inline const std::string s_val = "Hello";
};
```

### Attributes

```cpp
[[fallthrough]]
[[nodiscard]]
[[maybe_unused]]
```

* * *

## 🧹 Other Changes

- `static_assert` with no message

- u8 character literals

- Removed: trigraphs, `register`, `operator++(bool)`, `std::auto_ptr`

- Hex floating-point literals

- Const evaluation for all non-type template arguments

* * *

## 📚 References

- <https://www.bfilipek.com/2017/01/cpp17features.html>

- <https://isocpp.org/>

- <https://en.cppreference.com/>

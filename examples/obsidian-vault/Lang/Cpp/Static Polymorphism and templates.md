---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Embedded-Cpp #FW-References

**Videos:

- [Static polymorphism using std::variant and tuple with templates and
  lambdas](https://youtu.be/xpomlTd41hg?si=JKUI_EF2qHMcy5gW)

- Templates non-meta programming (simple template syntax and semantics, no type traits)

- C++20 Introspection Design Patterns (if requires)
  [video](https://youtu.be/sy32kAtsIKg?si=LPUsrINSzjhtEqwf)

```cpp fold title:if_requires_example.cpp
auto allocated_size(const auto &container) {
 if constexpr (requires { container.capacity(); }) {
  return container.capacity();

 } else {
  return container.size();
 }
}
```

#### cNTTP(class non-template type parameter)

- [C++ Weekly Video](https://youtu.be/iIizz2bbkiA?si=hE87Babd2Zc88cWm)

```Cpp fold title:cppweekly_cnttp_example.cpp
struct Vector {
 unsigned int x;
 unsigned int y;
 unsigned int z;
};

// CNTTP
// Class Non-Type Template Parameter
template<auto Vec>
constexpr auto use_vector() {
 std: :array<int, vec.x› data(};
 return data;
}

struct NullOptT {} NullOpt;

/**
 * Literal class type.
 *
 * Represents an optionally provided `int`.
 */
struct OptionalInt {
    constexpr OptionalInt(NullOptT) {}
    constexpr OptionalInt(int value): has_value(true), value(value) {}

    const bool has_value = false;
    const uint32_t value {};
};

/**
 * Prints whether or not a value was provided for "maybe" WITHOUT branching :)
 */
template<OptionalInt maybe>
void Print() {
    if constexpr(maybe.has_value) {
        std::cout << "Value is: " << maybe.value << std::endl;
    } else {
        std::cout << "No value." << std::endl;
    }
}

int main()
 constexpr Vector values {1,2,3};
 use_vector<values>();
 Print<123>();     // Prints "Value is: 123"
    Print<NullOpt>(); // Prints "No value."
}
```

**Articles:**

- [Template Polymorphism example with a
  HAL](https://blog.mbedded.ninja/programming/languages/c-plus-plus/designing-a-hal-in-cpp/#static-polymorphism-via-templates:~:text=and%20Virtual%20Methods-Static%20Polymorphism%20via%20Templates-C%2B%2B%20Concepts)

**Concepts and Important Topics:

- CRTP (Curiously Repeating Template Pattern)

```cpp fold title:crtp_example.cpp
namespace examples {

 // We inherit from ourselves (sort of!). This is called CRTP (Curiously Recurring Template Pattern).

 class GpioReal : public GpioBase<GpioReal> {

 public:
     void set(uint8_t value) {

         printf("%s() called with value: %d\n", __PRETTY_FUNCTION__, value);
     }
 };

}
```

- Concepts for same result as CRTP:

```cpp fold title:cntp_example_cpp20.cpp
namespace examples {
 template <typename T>

 concept Gpio = requires(T t, uint8_t value) {

     t.set(value);

 };


 // Empty base class, the concept will force the derived class to implement the set method

 template <Gpio T>

 class GpioBase : public T {};
}
```

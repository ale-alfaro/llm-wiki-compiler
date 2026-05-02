---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Embedded-Cpp #FW-References

#### Concepts

How can they be used in a function signature:

![[concepts1.png]] How they can be tested:

```cpp fold title:test_concepts.cpp
// Class template stub to create the different needed properties

template <bool nexcept , bool operatorPlus , bool validReturnType >
struct Stub {
  // Operator plus with controlled noexcept can be enabled
 Stub& operator+(const Stub& rhs) noexcept(nexcept)
 requires(operatorPlus && validReturnType)
 { return *this; }

  // Operator plus with invalid return type
 int operator+(const Stub& rhs) noexcept(nexcept)
  requires(operatorPlus && not validReturnType)

  { return {}; }

};

 // Create the different stubs from the class template
using NoAdd = Stub<true, false , true >;
using ValidClass = Stub<true, true, true >;
using NotNoexcept = Stub<false , true, true >;
using DifferentReturnType = Stub<true, true, false >;
//Assert, that mixed types are not allowed
static_assert(not Addable <int, double >);
//Assert that Add is used with at least two parameters
static_assert(not Addable <int>);
//C Assert that type has operator+
static_assert(Addable <int, int>);
static_assert(Addable <ValidClass , ValidClass >);
static_assert(not Addable <NoAdd , NoAdd >);
//D Assert that operator+ is noexcept
static_assert(not Addable <NotNoexcept , NotNoexcept >);
//E Assert that operator+ returns the same type
static_assert(not Addable <DifferentReturnType , DifferentReturnType >
```

**Enable_if_t - Enabling/disabling function overload through type traits (C++ 17 version
of concepts)

```cpp fold title:enable_if_t_right_wrong_example.cpp
/* WRONG */

struct T
{
    enum { int_t, float_t } type;

    template<typename Integer,
             typename = std::enable_if_t<Integer>::value>>
    T(Integer) : type(int_t) {}

    template<typename Floating,
             typename = std::enable_if_t<std::is_floating_point<Floating>::value>>
    T(Floating) : type(float_t) {} // error: treated as redefinition
};

/* RIGHT */

struct T
{
    enum { int_t, float_t } type;

    template<typename Integer,
             std::enable_if_t<<Integer>::value, bool> = true>
    T(Integer) : type(int_t) {}

    template<typename Floating,
             std::enable_if_t<Floating>::value, bool> = true>
    T(Floating) : type(float_t) {} // OK
};
```

#### Deducing This

Adding a template for the object within a member function

[CppCon Video](https://youtu.be/jXf--bazhJw?si=YbNuvoY3o9H1BWDV)

```cpp fold title:CRTP_with_deducing_this
CRTP WITH P0847

struct NumericalFunctions {

template < typename Self>
void scale(this Self&& self, double multiplicator) ( self.setValue(self.getValue() * multiplicator);

}:

struct Sensitivity : NumericalFunctions {

double getValue() const;

void setValue(double value);
}
//No class template, no recursion, it's just... er... P I guess?
```

# Deducing `this` Patterns in C++23

A code-first distillation of the new “deducing this” features in C++23.

* * *

## 1. Make `this` Explicit

Any member (or even a lambda) can spell out its implicit `this` as a deduced parameter:

```cpp
struct S {
  template<typename Self>
  auto func(this Self&& self) {
    // use self.* members
  }
};
```

RECURSIVE LAMBDAS (BASIC)

At last, this is what it’s all about, right?

- ﻿﻿The lambda must be generic (fairly obviously; you can’t spell the type)

- ﻿﻿Don’t actually implement Fibonacci this way; see Elements of Programming §3.6

```cpp fold title:recursive_lambda-basic


auto fib = [l (this auto self, int n) (

if (n < 2) return n;

return self(n-1) + self(n-2);

}
```

More practical example of a recursive lambda

```cpp fold title:recursive_lamda_practical
#include <filesystem>
#include <iostream>

namespace fs = std::filesystem;

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <directory>\n";
        return 1;
    }
    fs::path root{argv[1]};

    // Recursive lambda with deducing this:
    auto dir_size = [](this auto&& self, const fs::path& p) -> uintmax_t {
        if (!fs::exists(p))
            return 0;

        if (fs::is_regular_file(p)) {
            // Base case: file — just return its size
            return fs::file_size(p);
        }

        // Directory: sum sizes of entries
        uintmax_t total = 0;
        for (auto const& entry : fs::directory_iterator(p)) {
            total += self(entry.path());
        }
        return total;
    };

    try {
        uintmax_t bytes = dir_size(root);
        std::cout << "Total size of " << root << " = " << bytes << " bytes\n";
    } catch (const fs::filesystem_error& e) {
        std::cerr << "Filesystem error: " << e.what() << "\n";
        return 1;
    }

    return 0;
}
```

#### Overload sets with lambdas

```cpp fold title: visitOverload.cpp

#include <iostream>
#include <string>
#include <vector>
#include <variant>

template<class... Ts> struct overloaded : Ts... { 
    using Ts::operator()...; 
};

class Wheel {
 public:
    Wheel(const std::string& n): name(n) { }
    std::string getName() const {
        return name;
    }
 private:
    std::string name;
};

class Body {};

class Engine {};

class Car;

using CarElement = std::variant<Wheel, Body, Engine, Car>;

class Car {
 public:
    Car(std::initializer_list<CarElement*> carElements ):
      elements{carElements} {}

   template<typename T> 
   void visitCarElements(T&& visitor) const {
       for (auto elem : elements) {
           std::visit(visitor, *elem);
       }
   }
 private:
    std::vector<CarElement*> elements;
};

overloaded carElementPrintVisitor {                                            // (2)
    [](const Body& body)     {  std::cout << "Visiting body" << '\n'; },      
    [](this auto const& self, const Car& car)  {  car.visitCarElements(self);  // (4)
                                                  std::cout << "Visiting car" << '\n'; },
    [](const Wheel& wheel)   {  std::cout << "Visiting " 
                                          << wheel.getName() << " wheel" << '\n'; },
    [](const Engine& engine) {  std::cout << "Visiting engine" << '\n';}
};

overloaded carElementDoVisitor {                                               // (3)
    [](const Body& body)     {  std::cout << "Moving my body" << '\n'; },
    [](this auto const& self, const Car& car) {  car.visitCarElements(self);   // (5)
                                                std::cout << "Starting my car" << '\n'; },
    [](const Wheel& wheel)   {  std::cout << "Kicking my " 
                                          << wheel.getName()  << " wheel" << '\n'; },
    [](const Engine& engine) {  std::cout << "Starting my engine" << '\n';}
};


int main() {

    std::cout << '\n';

    CarElement wheelFrontLeft  = Wheel("front left");        
    CarElement wheelFrontRight = Wheel("front right");
    CarElement wheelBackLeft   = Wheel("back left");
    CarElement wheelBackRight  = Wheel("back right");
    CarElement body            = Body{};
    CarElement engine          = Engine{};

    CarElement car  = Car{&wheelFrontLeft, &wheelFrontRight,                    // (1)
             &wheelBackLeft, &wheelBackRight,
             &body, &engine};

    std::visit(carElementPrintVisitor, engine);
    std::visit(carElementPrintVisitor, car);
    std::cout << '\n';

    std::visit(carElementDoVisitor, engine);
    std::visit(carElementDoVisitor, car);
    std::cout << '\n';

}
```

```Cpp fold

// Deducing `this` Patterns in C++23: Code-first with comments



// 1. Explicit `this` parameter

struct S {

    template<typename Self>

    auto func(this Self&& self) {

        // 'self' is the object (lvalue/rvalue, cv-qualified)

        return /* ... use self.member ... */;

    }

};


// 2. Collapse CV-/ref-qualifiers
struct S2 {
    template<typename Self>
    auto f(this Self&& self) {
        if constexpr(std::is_lvalue_reference_v<Self>) return 1;  // called on lvalue
        else                                           return 2;  // called on rvalue
    }

};



// 3. Uniform Getter / Wrapper

template<typename Self>

auto get(this Self&& s) -> decltype(auto) {

    // Perfect-forwarding member access

    return std::forward<Self>(s).member;

}



// 4. Flatten CRTP-style mixins

struct Base {
    template<typename Self>
    void scale(this Self&& self, double s) {
        self.value *= s;
    }
};
struct Derived : Base {
    double value{};
};

// Usage:

// Derived d{2.0};

// d.scale(3.0);  // 6.0



// 5. By-value `this` for move-chain APIs

struct Mover {

    template<typename Self>

    auto transform(this Self self) {

        // 'self' is a prvalue copy/move — no dangling!

        self.x++;

        return self;

    }

    int x{0};

};



// 6. Generic & Recursive Lambdas

auto fib = [] (this auto self, int n) {

    // single lambda handles all cv/ref and recursion

    return n < 2 ? n : self(n-1) + self(n-2);

};

// static_assert(fib(6) == 8);



// Practical Example: Pipeline operator for any type

struct Pipe {

    template<typename Self, typename Func>

    auto operator|(this Self&& self, Func f) -> decltype(auto) {

        // Enables chaining: value | func1 | func2

        return f(std::forward<Self>(self));

    }

};

// Usage Example:

// Pipe p;

// auto result = p | 5 | [](int x){ return x + 1; } | [](int x){ return x * 2; };

// // result == (5 + 1) * 2 == 
```

#### POINTER-TO-MEMBER-FUNCTION

New and old do the same thing, but aren’t quite the same …

```cpp fold member_func_ptr
struct S {

void f(int) const &; void g(this const S&, int);

S S;

s. f(42); // OK today

s. g(42); // OK with P0847

auto pf = &S: :f;

(s.*pf) (42)
std: : invoke(pf, s, 42)

// type: auto (S::*)(int) -> void

// OK today

// OK today

auto pg = &S:: g;

// type: auto (*) (const S&, int) -> void

pg(s, 42);

// OK with P0847

std:: invoke(pg, s, 42) // still OK
```

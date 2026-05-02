---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#### Overview

![[type-erasure-design-analysis.png]]

Type erasure has 3 different roles that are widely known by the following names:

- **Concept** - Virtual class that declares the interface the types must implement.

  - These is not the same as a C++20 concept although it declares a requirement for a
    class to comply with to be treated the same

  - The biggest difference is that a Concept in this context is a type that can be used
    for storage of objects that are type erased

```cpp fold title:type_erasure_concept.cpp
/// The *minimal* run-time interface (v-table) – no templates here
struct ShapeConcept {
    virtual ~ShapeConcept() = default;
    virtual std::unique_ptr<ShapeConcept> clone() const = 0;   // Prototype
    virtual void draw()       const = 0;
    virtual void serialize()  const = 0;
};
```

- **Model** - Concrete class with implementation of the concept BUT this functions are
  only to forward the actual implemented functions

  - It uses template parameters: the concrete geometry `T` and (optionally) the
    *strategy* `S`.

  - Stores both **by value** (`T shape_; S strategy_;`) so the heap indirection pays off
    with cache-friendly payloads.

```cpp fold type_erasure_model
/// A type-erased “model” that **owns a concrete object by value**
template<typename GeomShape, typename DrawStrategy>
struct ShapeModel final : ShapeConcept {
    ShapeModel(GeomShape const& s, DrawStrategy strat)
        : shape_{s}, strategy_{std::move(strat)} {}

    // --- Prototype pattern: deep copy preserves value semantics
    std::unique_ptr<ShapeConcept> clone() const override {
        return std::make_unique<ShapeModel>(*this);
    }

    // --- External polymorphism: forward to free functions / strategy
    void draw() const override       { strategy_(shape_);           }
    void serialize() const override  { ::serialize(shape_);         }

private:
    GeomShape    shape_;     // *value* – no indirection inside
    DrawStrategy strategy_;  // can be a lambda, functor, std::function…
};
```

- **Wrapper class** - owns the pointer to the concrete class (Model) as a pointer of a
  Concept—`std::unique_ptr<ShapeConcept> pimpl;

  - It puts everything together for

```cpp fold type_erasure_wrapper
/// Public wrapper that looks like “just another value”
class Shape {
public:
    // Bridge pattern: a single templated ctor swallows *anything*
    template<typename GeomShape, typename DrawStrategy>
    Shape(GeomShape const& s, DrawStrategy strat)
      : pimpl_{std::make_unique<ShapeModel<GeomShape,DrawStrategy>>(s, std::move(strat))} {}

    // -------- value semantics (Rule of 5/0) -------------
    Shape(Shape const& other)            : pimpl_{other.pimpl_->clone()} {}
    Shape& operator=(Shape const& other) { pimpl_ = other.pimpl_->clone(); return *this; }
    Shape(Shape&&) noexcept            = default;
    Shape& operator=(Shape&&) noexcept = default;

    // ---------- friend trampolines (one hop + one v-call) ---------
    friend void draw   (Shape const& s) { s.pimpl_->draw();       }
    friend void serialize(Shape const& s) { s.pimpl_->serialize(); }

private:
    std::unique_ptr<ShapeConcept> pimpl_;   // single indirection per value
};
```

#### Background

Traditionally dynamic polymorphism is thought to be composed of 3 design patterns:

| Role | Implemented as | Purpose |
| --- | --- | --- |
| **Bridge** | a **templated constructor** in the public wrapper (`CppborItem`) that accepts *any* concrete object (e.g. `CppborUInt`) and an optional strategy (e.g. a lambda for serializing) | injects a run-time pointer to an internal *concept* object without exposing it |
| **Prototype** | a `clone()` virtual in the hidden `ItemConcept` base | preserves value semantics (copy/move) |
| **External Polymorphism** | free functions`serialize(shape)` that forward to `pimpl->draw()` etc. | lets operations live **outside** the concrete types, so shapes know *nothing* about available affordances |
| Internally, `ShapeConcept` declares the virtual interface once; `ShapeModel<T,S>` (a template) stores the concrete object **by value** plus an optional strategy and implements the virtual by forwarding to free functions or the injected lambda. The wrapper owns a `unique_ptr<ShapeConcept>`, so user code just treats `Shape` like an ordinary value. |  |  |

#### Example

```cpp fold title:full_example.cpp
// Type Erasure Sample Code.
//
// Implementation of Klaus Iglberger's C++ Type Erasure Design Pattern.
//

// High Level Summary of the Design
// - `class Shape` and global functions (`serialize()`, `draw()`, etc.)
//   - The external client facing interface.
//   - Holds a pointer to `ShapeConcept` internally.
// - `class ShapeConcept`
//   - The internal interface of the Bridge Design Pattern.
//   - It is needed to hide the template parameter of `ShapeModel<T>`.
// - `class ShapeModel<T>`
//   - The templated implementation of `ShapeConcept`.
//   - Routes virtual functions to global functions.

// CAUTION: The following deleted functions serve 2 purposes:
// 1. Prevent the compiler from complaining about missing global functions
//    `serialize()` and `draw()` when seeing the using declarations in
//    `ShapeModel::serialize()` and `ShapeModel::draw()`, as if the compiler
//    did not see the `friend` definitions within `class Shape`.
// 2. Prevent runaway recursion in case a concrete `Shape` such as `Circle`
//    does not define a `serialize(const Circle&)` or `draw(const Circle&)`
//    function.
template <typename T>
void serialize(const T&) = delete;

template <typename T>
void draw(const T&) = delete;

#ifdef __clang__

// CAUTION: Workaround for clang.
// The following forward declarations of explicit specialization of
// `serialize()` and `draw()` prevent Clang from complaining about redefintion
// errors.
class Shape;

template <>
void serialize(const Shape& shape);

template <>
void draw(const Shape& shape);

#endif  // __clang__

template <typename T>
concept IsShape = requires(T t) {
  serialize(t);
  draw(t);
  { std::declval<std::ostream&>() << t } -> std::same_as<std::ostream&>;
};

class Shape {
  // NOTE: Definition of the explicit specialization has to appear separately
  // later outside of class `Shape`, otherwise it results in error such as:
  //
  // ```
  // error: defining explicit specialization 'serialize<Shape>' in friend declaration
  // ```
  //
  // Reference: https://en.cppreference.com/w/cpp/language/friend
  friend void serialize<>(const Shape& shape);
  friend void draw<>(const Shape& shape);

  friend std::ostream& operator<<(std::ostream& os, const Shape& shape) {
    return os << *shape.pimpl_;
  }

  // The External Polymorphism Design Pattern
  class ShapeConcept {
   public:
    virtual ~ShapeConcept() {}
    virtual void serialize() const = 0;
    virtual void draw() const = 0;
    virtual void print(std::ostream& os) const = 0;

    // The Prototype Design Pattern
    virtual std::unique_ptr<ShapeConcept> clone() const = 0;

    friend std::ostream& operator<<(
        std::ostream& os, const ShapeConcept& shape) {
      shape.print(os);
      return os;
    }
  };

  template <typename T>
  class ShapeModel : public ShapeConcept {
    T object_;

   public:
    ShapeModel(const T& value)
        : object_{value} {
    }

    void serialize() const override {
      // CAUTION: The using declaration tells the compiler to look up the free
      // serialize() function rather than the member function.
      //
      // Reference: https://stackoverflow.com/a/32091297/4475887
      using ::serialize;

      serialize(object_);
    }

    void draw() const override {
      using ::draw;

      draw(object_);
    }

    void print(std::ostream& os) const override {
      os << object_;
    }

    // The Prototype Design Pattern
    std::unique_ptr<ShapeConcept> clone() const override {
      return std::make_unique<ShapeModel>(*this);
    }
  };

  // The Bridge Design Pattern
  std::unique_ptr<ShapeConcept> pimpl_;

 public:
  // A constructor template to create a bridge.
  template <IsShape T>
  Shape(const T& x)
      : pimpl_{new ShapeModel<T>(x)} {
  }

  Shape(const Shape& s)
      : pimpl_{s.pimpl_->clone()} {
  }

  Shape(Shape&& s)
      : pimpl_{std::move(s.pimpl_)} {
  }

  Shape& operator=(const Shape& s) {
    pimpl_ = s.pimpl_->clone();
    return *this;
  }

  Shape& operator=(Shape&& s) {
    pimpl_ = std::move(s.pimpl_);
    return *this;
  }
};

template <>
void serialize(const Shape& shape) {
  shape.pimpl_->serialize();
}

template <>
void draw(const Shape& shape) {
  shape.pimpl_->draw();
}

class Circle {
  double radius_;

public:
  explicit Circle(double radius) : radius_(radius) {
  }

  double radius() const {
    return radius_;
  }
};

std::ostream& operator<<(std::ostream& os, const Circle& circle);
void serialize(const Circle& circle);
void draw(const Circle& circle);

std::ostream& operator<<(std::ostream& os, const Circle& circle) {
  return os << "Circle(radius = " << circle.radius() << ")";
}

void serialize(const Circle& circle) {
  std::cout << "Serializing a Circle: " << circle << std::endl;
}

void draw(const Circle& circle) {
  std::cout << "Drawing a Circle: " << circle << std::endl;
}

class Square {
  double width_;

public:
  explicit Square(double width) : width_(width) {
  }

  double width() const {
    return width_;
  }
};

std::ostream& operator<<(std::ostream& os, const Square& square);
void serialize(const Square& square);
void draw(const Square& square);

std::ostream& operator<<(std::ostream& os, const Square& square) {
  return os << "Square(width = " << square.width() << ")";
}

void serialize(const Square& square) {
  std::cout << "Serializing a Square: " << square << std::endl;
}

void draw(const Square& square) {
  std::cout << "Drawing a Square: " << square << std::endl;
}

int main() {
  using Shapes = std::vector<Shape>;

  Shapes shapes;
  shapes.emplace_back(Circle{2.0});
  shapes.emplace_back(Square{1.5});
  shapes.emplace_back(Circle{4.2});

  std::cout << "\nDrawing all shapes:\n";
  std::for_each(shapes.begin(), shapes.end(), [](const Shape& shape) {
    draw(shape);
  });

  std::cout << "\nSerializing all shapes:\n";
  std::for_each(shapes.begin(), shapes.end(), [](const Shape& shape) {
    serialize(shape);
  });
}
```

#### References

- Klaus Igdelberg Cppcon 2022 Talk

  - [[type-erasure-design-analysis.pdf]]

  - Example Implementations:

    - <https://gist.github.com/vladiant/3ad3ace6e010378213b127bca25b879d>

    - <https://github.com/olivia76/cpp-te/tree/main>

    - <https://github.com/yaozhenx/type-erasure/tree/main>

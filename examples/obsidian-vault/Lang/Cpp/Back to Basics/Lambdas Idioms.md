---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#### Overload Set

A struct can inherit from multiple lambdas and use their call operator to overload the
call operator for that specific argument type

```cpp fold title:overload_set
template ‹ typename... Ts>

struct overload : Ts... {

using Ts::operator()...;

};

int main@) {

overload f = {

[](int i){ std::cout « "int thingy"; }, [](float f){ std::cout « "float thingy"; }

};

}

std: :variant<int, float> v = 42;

std::visit(f, v); // prints int thingy
```

#### Lambdas as Member Variables

```cpp fold title:decltype_lamda
using WidgetSet = std::set<

Widget,

decltype([] (Widget& lhs, Widget& rhs) { return lhs.x < rhs.X; })

>;

WidgetSet widgets;
```

#### Deducing this for recursive overload set

```Cpp fold title:recursive_overload_set
struct Leaf;
struct Node;

using Tree = std::variant<Leaf, Node*>;

struct Node t

Tree left, right;

template <typename... Ts>

struct overload : Ts... { using Ts::operatorO...; }

int countLeaves(const Tree& tree) {

return std:: visit(overload{

[] (const Leaf&) { return 1; 3, [] (this const auto&

self, const Node* node) →> int f

return visit(self, node-›left) + visit(self, node-›right);

}

}, tree);

}
```

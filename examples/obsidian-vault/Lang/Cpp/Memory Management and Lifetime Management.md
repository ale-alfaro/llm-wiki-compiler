---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
### Concepts

- value types (lvalue, rvalue, etc)

- ![[IMG_1449.png]]

```Cpp fold title:lvalues_and_rvalues2.cpp
int main()
{
    int i, j, *p;

    // Correct usage: the variable i is an lvalue and the literal 7 is a prvalue.
    i = 7;

    // Incorrect usage: The left operand must be an lvalue (C2106).`j * 4` is a prvalue.
    7 = i; // C2106
    j * 4 = 7; // C2106

    // Correct usage: the dereferenced pointer is an lvalue.
    *p = i;

    // Correct usage: the conditional operator returns an lvalue.
    ((i < 3) ? i : j) = 7;

    // Incorrect usage: the constant ci is a non-modifiable lvalue (C3892).
    const int ci = 7;
    ci = 9; // C3892
}
```

### Videos

- Non-owning Views (span, string_view, etc)

  - Replace pointer arithmetic with them
    ([video](https://youtu.be/MsujPM2wDmk?si=YtECGboPia0Lqicg))

- Smart pointers for C integration

  - in_out_ptr/out_ptr [video](https://youtu.be/DHKoN6ZBrkA?si=DngNOE8g0zEVLPab)

- C++ std::pmr library for custom allocators.

  - [C++ Weekly - PMR allocator common
    mistakes](https://www.youtube.com/watch?v=6BLlIj2QoT8)

```cpp fold title:pmr_example.cpp
namespace pmr_helper {
 // Prints if new/delete gets used.

 class print_alloc : public std::pmr::memory_resource {
 private:
 void* do_allocate(std::size_t bytes, std::size_t alignment) override {
  std::cout << "Allocating " << bytes << '\n';
  return std::pmr::new_delete_resource()->allocate(bytes, alignment);

 }


 void do_deallocate(void* p, std::size_t bytes,

  std::size_t alignment) override {

  std::cout << "Deallocating " << bytes << ": '";

  for (std::size_t i = 0; i < bytes; ++i) {

   std::cout << *(static_cast<char*>(p) + i);

  }
  std::cout << "'\n";
  return std::pmr::new_delete_resource()->deallocate(p, bytes, alignment);

 }



 bool do_is_equal(
  const std::pmr::memory_resource& other) const noexcept override {

  return std::pmr::new_delete_resource()->is_equal(other);

  }
 };



 template <typename Container, typename... Values>

  auto create_container(auto *resource, Values&&... values) {

  Container result{resource};

  result.reserve(sizeof...(values));

  (result.emplace_back(std::forward<Values>(values)), ...);

  return result;

 };

 int main() {

  // remember initializer lists are broken.
  print_alloc mem;
  std::pmr::set_default_resource(&mem);

  std::array<std::uint8_t, 1024> buffer{};

  std::pmr::monotonic_buffer_resource mem_resource(buffer.data(),

  buffer.size());

  std::cout << "initializing vector\n";

  auto vec = create_container<std::pmr::vector<std::pmr::string>>(
  &mem_resource,
  "Hello", "World", "Hello Long String", "Another Long String");

  std::cout << "exiting main\n";

 }
}
```

- Move constructors and ways they can be broken:
  [video](https://youtu.be/ZuTJAP4oMwg?si=VTfZOA44kHXdCFez)

- Forwarding References Cppcon [video](https://youtu.be/0GXnfi9RAlU?si=yf5BguUn0rCkoyXm)


![[B2B_Forwarding_References.pdf]] ``

### Articles

- [5 ways to construct
  objects](https://www.cppstories.com/2023/five-adv-init-techniques-cpp/)
  ![[types_of_constructors.jpg]]

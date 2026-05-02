---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Embedded-C #FW-References

**References:

- [cppreferences compiler support
  tables](https://en.cppreference.com/w/cpp/compiler_support.html)

**Videos**

- [List of videos from CppCon and other sources](https://cppemb.com/)

- [CppCon 2022 - Modern C++ to make embedded programming more
  productive](https://www.youtube.com/watch?v=6pXhQ28FVlU&list=PL6bf-ULSbufupMVn1XHIT6dXq0h06PLUQ)

  - Timestamps:

    - Declarative GPIO [5:28](https://www.youtube.com/watch?v=6pXhQ28FVlU&t=328s)

    - Compiler-driven lookup table generation
      [16:15](https://www.youtube.com/watch?v=6pXhQ28FVlU&t=975s)

    - Address-like structures
      [23:21](https://www.youtube.com/watch?v=6pXhQ28FVlU&t=1401s)

    - Lean stream-based I/O [31:00](https://www.youtube.com/watch?v=6pXhQ28FVlU&t=1860s)

    - Using heap in embedded applications (arena allocators)
      [40:55](https://www.youtube.com/watch?v=6pXhQ28FVlU&t=2455s&pp=0gcJCTAAlc8ueATH)

    - Unlock std::chrono [50:23](https://www.youtube.com/watch?v=6pXhQ28FVlU&t=3023s)

    - Unlock std::random [54:56](https://www.youtube.com/watch?v=6pXhQ28FVlU&t=3296s)

**Read Material:**

- C++ Weekly Best Practices Book:

  - ![[cpp23_best_practices.pdf]]

- Mbedded Ninja articles:

  - [C++ On Embedded Systems]([C++ On Embedded
    Systems](https://blog.mbedded.ninja/programming/languages/c-plus-plus/cpp-on-embedded-systems/))

  - [Designing a HAL in C++]([Designing a HAL in
    C++](https://blog.mbedded.ninja/programming/languages/c-plus-plus/designing-a-hal-in-cpp/))

- Performance report C vs C++:

  - ![[Technical Report on C++ performance.pdf]]

- [Embedded C++ The Programming Guide Lines](https://www.caravan.net/ec2plus/guide.html)


**General topics on C++ optimization and good practices

- [Avoiding std::move!](https://youtu.be/6SaUwqw4ueE?si=6ltTNisF9H4ZTYuE)

  - Why? Creates and destroys temporary objects so ctor and dtor are called (fine if the
    object is trivially constructed and destroyed )

- make copy constructors explicit to avoid copies by accident
  [video](https://youtu.be/5wJ-jKK_Zy0?si=5qlNPpxod5l4WSlV)

- Use std::bit_cast instead of reinterpret_cast and mencpy
  ([Video](https://youtu.be/crErQJMwz1g?si=VChzVgSTCxts5tEI))

- [Return value optimization (RVO)](https://youtu.be/DzUAqXMUjtc?si=d_6zzXjtsJvTOd-p)

  - Takeaway use bracket constructor and simple composable funcs

- Use Emplace back vs push back
  ([video](https://youtu.be/jKS9dSHkAZY?si=m8KFjW-thvDEaxJ-)) `

```cpp fold title:emplace_vs_push_back.cpp

std: :vector<std: :string> vec; 
// call emplace_back when you want to create a new object 
vec.emplace_back(100, 'c'); 
//1.reserve space for a new string 
// 2. placement new() into new space (args...) 

// call push_back when you already have an object 
vec.push_back(std::string(100, 'c')); 

// 1. create a temporary string on the stack(100, 'c') 
// 2. resize the vector 
// 3. std::move(temporaryString) into new memory location 

vec.emplace_back(std::string(100, 'c')); 

// 0. create temporary string on the stack 
// 1. reserve space for a new string 
// 2. placement new() into new space (args...) (move constructor)
```

- use auto but it’s not a catch all!

```cpp fold title:auto_rules.cpp

// is there a hidden copy?  
// why isn't it a reference? 
// how does auto even work? 
// * "auto’ uses the exact same rules as template type parameters
// * "auto’ will never deduce a reference operator(&)  
// * “const-ness will be deduced 
// * "auto’ will never perform a conversion  
// * 'auto’ is generally better performing because it eliminates
// accidental conversions! 
const std::map<std::string, std::string> &get_data(); 
int main() { 
 for([[maybe_unused]] const auto &[key, value] : get_data())) {

 }
}
```

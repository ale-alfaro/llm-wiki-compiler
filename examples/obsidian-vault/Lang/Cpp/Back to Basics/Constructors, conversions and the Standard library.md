---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#### Destructors bloat your code

If your struct has a destructor it will add 300 lines of assembly!
[Video](https://youtu.be/D8eCPl2zit4?si=umFOG1FzDpARnTag)

#### Implicit conversions are the devil

Code below has a size_t (64bit unsigned) iterator type.
lowest (32bit signed) is converted to this type and back!

```Cpp fold title:int_implicit_conversion
[[nodiscard]] auto put_pivot_in_place(std::span<int> v) {
 auto& pivot = v.back();
 //THIS SHOULD BE A SIZE_T
 int lowest = 0;
 //COMPARISON SHOULD BE elem != end. EVEN EASIER AND BETTER IS TO USE RANGE FOR LOOP
 for(auto elem = v.begin(); elem ‹ v.end; elem++) {

 if (*elem ‹ pivot) {
  std:: swap(*elem, v[lowest]);
 }
  ++lowest;
 }

 std:: swap(pivot, v[lowest]);
 return lowest;
}
```

#### Use -Wsigned-conversion and -Wimplicit-conversion

Use C++20 safe integer comparisons!

![[Pasted image 20250704000215.png]]

# 1 know what your library does

NOT A CONCLUSIVE LIST

- ﻿﻿Are the types / functions constexpr enabled?
  what implicit conversions exist?

- ﻿﻿W1l1 the function / constructor implicitly allocate?

- ﻿﻿WILL dynamically allocate:

- ﻿﻿vector

- ﻿﻿deque

- ﻿﻿Required to allocate for each node

- List

- ﻿﻿Map

- set

- Might allocate (have snall object optimizations)

- ﻿﻿string

- ﻿﻿function

- any

- ﻿﻿Never allocate:

- ﻿﻿pair

- ﻿﻿tuple

- ﻿﻿variant

- ﻿﻿optional

- ﻿﻿array (it also has no construdtors!!)

Explicit conditional constructors!

```Cpp fold explicit_cond_constructor.cpp
template < typename Contained>
struct S {

S() = default;

explicit(std::is_trivial_v‹Contained>) S(Contained &&c_) : {}

explicit(std::is_trivial_v<Contained>) S(const Contained &c_) : {}

explicit(std::is_trivial_v<Contained>) operator Contained() const { }

private:
  Contained contained;
};
```

Optimize containers like std pair by no defining constructors!

```cpp fold FAST_PAIR
template<typenane First, typename Second>
struct Pair{
  First first;
  Second second;
};
```

templatestypenane First, typename Second› struct Pairt First first;

Second second;

tenplate‹typenane F, typenane 5>

Pair(F 68f, 5 66s)

1 first(stdi:for), secoNd(s)

Pair(const First Sf, const Second Ss)

: first(f), second (s)

}

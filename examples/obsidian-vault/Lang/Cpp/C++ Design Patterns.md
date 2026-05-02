---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Embedded-Cpp #FW-References

Patterns to know:

- Type erasure. **VERY USEFUL**

  - Used often for polymorphism and having a vector of different classes that share an
    interface.

  - [Klaus idelberger Cppcon](https://meetingcpp.com/mcpp/slides/2021/Type%20Erasure%20-%20A%20Design%20Analysis9268.pdf)

    - [[Type Erasure - A Design Analysis9268.pdf]]

## Videos

- C++ weekly - Observer Design Pattern and
  others([video](https://youtu.be/A_MsXney3EU?si=v4tB7nfaStrMTSLW))

  - Notes:
    [https://github.com/lefticus/cpp_weekly/issues/29](https://github.com/lefticus/cpp_weekly/issues/29)

- CppCon CRTP for polymorphism - Klaus Igledberger
  ([video](https://youtu.be/pmdwAf6hCWg?si=PkJdnKO44VwUTe5r))

## Visitor design pattern

Cppcon 23 Klaus Idelberger - [Video](https://www.youtube.com/watch?v=PEcy1vYHb8A) -
[[Breaking-Dependencies-The-Visitor-Design-Pattern-Klaus-Iglberger-CppCon-2022.pdf]]]

![[Pasted image 20250702013100.png]]

##### Advantages

This style of programming has many advantages:

- ﻿﻿There is no inheritance hierarchy (non-intrusive)\
  No cyclic dependency (implementation flexibility)

- ﻿﻿The code is so much simpler (KISS)

- ﻿﻿There are no virtual functions

- ﻿﻿There are no pointers or indirections

- ﻿﻿There is no manual dynamic memory allocation\
  There is no need to manage lifetime

- ﻿﻿There is no lifetime-related issue (no need for smart pointers)

- ﻿﻿The performance is better

These are the advantages of value semantics!

##### Disadvantages

- ﻿﻿Use alternatives of approximately the same size

- ﻿﻿Revert to pointers (with a performance disadvantage)

- ﻿﻿Use the Proxy design pattern

- ﻿﻿Use the Bridge design pattern

- ﻿﻿Be aware that std:: variant reveals a lot of information (dependencies!)

- ﻿﻿Revert to pointers (with a performance disadvantage)

---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
## Overview 

Meta-build tool that works with different build backends making it cross-platform and easier to abstract the build system infrastructure 


CMake has 4 stages for its build system:
- Configure
- Build
- Test
- Install
![[CMAKE STAGES.png]]

### Configure Stage

CMake creates the CMakeCache.txt at this step 

![[CMake CONFIGURE STAGE.png]]

___
## CMake Scripting Language

### Macros vs Functions
```cmake
macro(macro_name var1 var2 ...)
...
endmacro()
function(fn_name var1 var2 ...)
...
endfunction()
```


| Function                                                                                     | Macro                                                                                                            |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| <br>- **Has a scope . Cannot change caller variables[^1]**<br>- Not inlined, easier to debug | <br>- **No Scope. Can change caller variables**<br>- Inlined like a macro and makes debugging and tracing harder |
[^1]: Unless using the PARENT_SCOPE when setting caller variables

### Lists
```Cmake
list(LENGTH <list> <out-var>)
list(GET <list> <element index> [<index> ...] <out-var>)
list(JOIN <list> <glue> <out-var>)
list(SUBLIST <list> <begin> <length> <out-var>)

# Search
list(FIND <list> <value> <out-var>)

# Modification
list(APPEND <list> [<element>...])
list(FILTER <list> {INCLUDE | EXCLUDE} REGEX
<regex>)
list(INSERT <list> <index> [<element>...])
list(POP_BACK <list> [<out-var>...])
list(POP_FRONT <list> [<out-var>...])
list(PREPEND <list> [<element>...])
list(REMOVE_ITEM <list> <value>...)

```




___
## Template from C++ weekly

- [Intro to most of the template](https://youtu.be/YbgH7yat-Jo?si=DFiONO1qsSe87ZNb)

- [Latest video on template updates](https://youtu.be/ucl0cw9X3e8?si=MoJUbym5cxed6JNX)

- Has following:

  - Asan and UBSan

  - Fuzz testing

  - Catch2

___

## CMake Scripts repo:
[StableCoder/cmake-scripts](https://github.com/StableCoder/cmake-scripts)

- Code coverage

- Leak sanitizers

[^1]: Unless using the PARENT_SCOPE when setting the caller variables

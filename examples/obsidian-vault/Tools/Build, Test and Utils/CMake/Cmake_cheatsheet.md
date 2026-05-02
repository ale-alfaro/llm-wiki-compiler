---
id: CMake Cheatsheet
aliases: []
tags:
  - cmake
  - cheatsheet
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
From
[Embedded Ninja](https://blog.mbedded.ninja/programming/build-systems-and-package-managers/cmake/cmake-cheat-sheet/)


| Function                                                      | Explanation                                                                                                                                                                                                |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `set(srcs file1.c file2.c …)`                                 | Creates a variable (e.g. src), and assigns something to it (e.g. the list file1.c file2.c). To clear a variable, do not provide second argument, e.g. set(srcs).                                           |
| `include_directories(dir1 dir2 …)`                            | Adds the provided directory paths to the compilers list of directories that it will search for include files in, for any following targets.                                                                |
| `add_library(name STATIC/SHARED/MODULE file1.c file2.c …)`    | Adds a library target that will be build from the provided source files. DO NOT APPEND lib_ to the name (this is done automatically by cmake depending on architecture).                                   |
| `add_executable(name file1.c file2.c …)`                      | Adds an executable target (as opposed to a library target).                                                                                                                                                |
| `link_libraries(lib_1 lib_2 …)`                               | Links the provided libraries to all following targets in the CMakeLists.txt file. This is deprecated. It is recommended you use target_link_libraries() instead.                                           |
| `target_link_libraries(target_lib other_lib_1 other_lib_2 …)` | Links the provided libraries to the specific target library. link_libraries() can be used to apply to libraries to all following targets (i.e. no specific target is provided), however, it is deprecated. |
| `install(TARGETS targets…)`                                   | Used to place build output into certain directories on the user’s system (as well as do things like assign privileges to these files).                                                                     |

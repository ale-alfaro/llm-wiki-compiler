---
aliases:
  - C Language Support — Zephyr Project Documentation
categories:
  - "[[clippings]]"
title: C Language Support — Zephyr Project Documentation
source: https://docs.zephyrproject.org/latest/develop/languages/c/index.html
author:
  - "[[Wikipedia]]"
created: 2026-03-13
description:
tags:
  - clippings
  - wikipedia
note_type: other
modified: 2026-04-19
---

#webclip/unread

# C Language Support — Zephyr Project Documentation


## Language Standards

Zephyr does not target a specific version of the C standards; however, the Zephyr codebase makes extensive use of C99 features:

- inline functions
- standard boolean types (`bool` in `<stdbool.h>`)
- fixed-width integer types (`[u]intN_t` in `<stdint.h>`)
- designated initializers
- variadic macros
- `restrict` qualification

Additionally, some components or parts of them make use of features introduced in the C11 and C17
- \_Generic keyword
- \_Static\_assert keyword

> [!NOTE] It is recommended to use a compiler toolchain that supports at least the C17 standard for developing with Zephyr.
> 

## Standard Library

The [C Standard Library](https://en.wikipedia.org/wiki/C_standard_library) is an integral part of any C program, and Zephyr provides the support for a number of different C libraries for the applications to choose from, depending on the compiler toolchain being used to build the application.

- [[Picolibc]]

## Formatted Output

C defines standard formatted output functions such as `printf` and `sprintf` and these functions are implemented by the C standard libraries.

Each C standard library has its own set of requirements and configurations for selecting the formatted output modes and capabilities. Refer to each C standard library documentation for more details.

## Dynamic Memory Management

While the details of the dynamic memory management implementation varies across different C standard libraries, all supported libraries must conform to the following conventions. Every supported C standard library shall:

- manage its own memory heap either internally or by invoking the hook functions (for example, `sbrk()`) implemented in `libc-hooks.c`.
- maintain the architecture- and memory region-specific alignment requirements for the memory blocks allocated by the standard dynamic memory allocation interface (for example, [`malloc()`](https://docs.zephyrproject.org/latest/doxygen/html/stdlib_8h.html#a9c36d0fe3ec4675cbffdc9b52f5fb399)).
- allocate memory blocks inside the `z_malloc_partition` memory partition when userspace is enabled. See [Pre-defined Memory Partitions](https://docs.zephyrproject.org/latest/kernel/usermode/memory_domain.html#memory-domain-predefined-partitions).


> [!NOTE] `k_malloc` vs `malloc`
> Native Zephyr applications should use the [memory management API](https://docs.zephyrproject.org/latest/kernel/memory_management/index.html#memory-management-api) supported by the Zephyr kernel such as [`k_malloc()`](https://docs.zephyrproject.org/latest/doxygen/html/group__heap__apis.html#gaa8edf1e63e5d5dd78d7adcfd787394ee) in order to take advantage of the advanced features that they offer.
> 
> C standard dynamic memory management interface functions such as [`malloc()`](https://docs.zephyrproject.org/latest/doxygen/html/stdlib_8h.html#a9c36d0fe3ec4675cbffdc9b52f5fb399) should be used only by the portable applications and libraries that target multiple operating systems.

## References

### Zephyr Docs

- [Common C library code](https://docs.zephyrproject.org/latest/develop/languages/c/common_libc.html)
	- [Time function](https://docs.zephyrproject.org/latest/develop/languages/c/common_libc.html#time-function)
	- [Dynamic Memory Management](https://docs.zephyrproject.org/latest/develop/languages/c/common_libc.html#dynamic-memory-management)
- [Minimal libc](https://docs.zephyrproject.org/latest/develop/languages/c/minimal_libc.html)
	- [Functions](https://docs.zephyrproject.org/latest/develop/languages/c/minimal_libc.html#functions)
	- [Formatted Output](https://docs.zephyrproject.org/latest/develop/languages/c/minimal_libc.html#formatted-output)
	- [Dynamic Memory Management](https://docs.zephyrproject.org/latest/develop/languages/c/minimal_libc.html#dynamic-memory-management)
	- [Error numbers](https://docs.zephyrproject.org/latest/develop/languages/c/minimal_libc.html#error-numbers)
- [Newlib](https://docs.zephyrproject.org/latest/develop/languages/c/newlib.html)
	- [Types of Newlib](https://docs.zephyrproject.org/latest/develop/languages/c/newlib.html#types-of-newlib)
	- [Formatted Output](https://docs.zephyrproject.org/latest/develop/languages/c/newlib.html#formatted-output)
	- [Dynamic Memory Management](https://docs.zephyrproject.org/latest/develop/languages/c/newlib.html#dynamic-memory-management)
- [Picolibc Module](https://docs.zephyrproject.org/latest/develop/languages/c/picolibc.html#picolibc-module)
	- [Toolchain Picolibc](https://docs.zephyrproject.org/latest/develop/languages/c/picolibc.html#toolchain-picolibc)
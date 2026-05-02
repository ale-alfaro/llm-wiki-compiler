---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

# Spin Lock

The most fundamental primitive for concurrency and uses to build other higher level concurrency primitives. Its purpose is to lock/ unlock shared access of variables on the hardware level. To achieve this spin locks mask (disable) hardware interrupts.

Things to consider:
- It is not thread aware so cant be used for IPC
- Implementation  works on single CPU systems and multiple CPU systems (SMP) 


# Semaphores

# Mutexes


# Conditional Variables

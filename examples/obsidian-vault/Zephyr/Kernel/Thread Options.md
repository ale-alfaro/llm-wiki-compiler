---
aliases:
  - Thread Options
tags:
title: Thread Options
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

## `k_thread` Opts


Available as Bitwise Macros:

| Name             | Bit | Description                                  |
| ---------------- | --- | -------------------------------------------- |
| K_ESSENTIAL      | 0   | system thread that must not abort            |
| K_FP_REGS        | 1   |                                              |
| K_USER           | 2   | user mode thread                             |
| K_INHERIT_PERMS  | 3   | Inherit Permissions.                         |
| K_CALLBACK_STATE | 4   | Callback item state.                         |
| K_DSP_REGS       | 6   | DSP registers are managed by context switch. |

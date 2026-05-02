---
id: Native Simulator
aliases:
  - Native Simulator and Posix
tags: []
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Native Simulator and Posix

**Native Simulator**:\
A board that simulates HW using *Posix* to abstract hardware and time-based events and scheduling
- [Zephyr docs on the native_sim board](https://docs.zephyrproject.org/latest/boards/native/native_sim/doc/index.html#native_sim)


**Native Posix**:\
Is Native Simulator’s predecessor and is another name to refer to the same concept.

**Posix**:\
All code should run in Native Sim that ran on Native Posix.

More on the [Posix architecture](https://docs.zephyrproject.org/latest/boards/native/doc/arch_soc.html#posix-arch-deps) in Zephyr

---

# Notes

![[HOWTO - Native Sim|Sim]]

---

![[native_sim board]]

---

## References

Best video giving an overview of what the native simulator is: [Native Simulator -Alberto Escolar](https://www.youtube.com/watch?v=umYKNDufY5E)

Comprehensive design documentation and source code of Native Simulator:

[BabbleSim Github Repo](https://github.com/BabbleSim/native_simulator)

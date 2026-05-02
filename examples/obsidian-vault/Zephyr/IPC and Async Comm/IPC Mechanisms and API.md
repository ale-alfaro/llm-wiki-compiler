---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

Amazing talk by one of the Zephyr kernel developers. Andy Ross, that contains most if not all you need to know about Zephyr IPC. As always keeping things simple is better and using a controlled subset of Zephyr's wide range of IPC mechanisms is always preferred. His top picks were from the least complex to the most and that's how he would suggest going from one level to the next. only with scaling complexity in asynchronous problems:
- k_spinlock (busy wait)
- k_sem (as signalig mechanism and also a lighweight mutex)
- k_queue (and derivatives k_fifo/k_lifo)
- k_pipe (preferred) and k_msgq


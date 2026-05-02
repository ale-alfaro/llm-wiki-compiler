---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

# Talks


- [Zephyr Talk on Schedulet - Andy Ross](https://youtu.be/6PpjYa1kJ1U?si=s8qGhHNKF2y4dY_K)

# Threads ( tasks)


```C
blink_tid = k_thread_create(&blink_thread,          // Thread struct
‎                            blink_stack,            // Stack
‎                            K_THREAD_STACK_SIZEOF(blink_stack),‎
‎                            blink_thread_start,     // Entry point
‎                            NULL, NULL, NULL,       // Arguments
‎                            7,                      // Priority‎
‎                            0,                      // Options‎
‎                            K_NO_WAIT);             // Delay
```


> [!note] Arguments of `k_thread_create`
> - **&blink_thread:** Points to the thread's data structure.
> - **blink_stack:** The stack memory allocated for the thread.
> - **K_THREAD_STACK_SIZEOF(blink_stack):** Specifies the size of the stack.
> - **blink_thread_start:** The function executed by the thread (i.e., the entrypoint of the thread).
> - **7:** The thread's priority. Similar to Linux, lower numbers indicate higher priorities. You can read more about [thread priorities here](https://docs.zephyrproject.org/latest/kernel/services/threads/index.html#thread-priorities). Notice that Zephyr also implements _cooperative_ multitasking where threads must explicitly give up execution (rather than be preempted by other, higher-priority threads). Use negative priority numbers to indicate a cooperative thread (whereas positive numbers indicate preemptive threads).
> - **0: Thread options** - Read more about the options available here [[Thread Options]]
> - **K_NO_WAIT:** Starts the thread immediately. You could specify a time here to delay the thread execution start or use K_FOREVER to start the thread manually with k_thread_start().

## Defining Thread Stacks

In Zephyr, each thread requires its own stack for storing local variables, function call data, and more. The `K_THREAD_STACK_DEFINE` macro is used to allocate memory for the stack of the the thread. Example:


```c
‎#define BLINK_THREAD_STACK_SIZE 256‎
K_THREAD_STACK_DEFINE(blink_stack, BLINK_THREAD_STACK_SIZE);‎
```
Here, BLINK_THREAD_STACK_SIZE sets of the stack to 256 bytes


> [!warning] Minimum Stack Size
> - 256 is the **unoficial bare minimum.** 
> - 512 is small
> - 1024 is a good minimum for most applications 


## Thread Data Structure

Zephyr uses a k_thread structure to manage thread information, such as:
 - state
 - priority
 - stack pointer

```c
static struct k_thread blink_thread;‎
```

# Scheduler

[Src ](https://maksimdrachov.github.io/zephyr-rtos-tutorial/docs/5-scheduling/introduction.html)

![[Zephyr Scheduler]]


## Types of scheduler

The queue types:

- **Simple linked-list ready queue** (`CONFIG_SCHED_DUMB`) 
    - simple unordered list
    - very fast constant time performance for single threads
    - very low code size
    - useful for systems with: 
        - constrained code size
        - small number of threads (<=3) at any given time
- **Red/black tree ready queue** (`CONFIG_SCHED_SCALABLE`) 
    - red/black tree ([wiki](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree))
    - slower constant time insertion and removal overhead
    - requires extra 2Kb code
    - scales cleanly and quickly into many thousands of threads
    - Useful for systems with: 
        - many concurrent runnable threads (>20 or so)
- **Traditional multi-queue ready queu**e (`CONFIG_SCHED_MULTIQ`) 
    - classic array of lists, one per priority (max 32 priorities)
    - tine code size overhead vs. the “dumb” scheduler
    - runs in 0(1) time with very low constant factor
    - requires fairly large RAM budget to store list heads
    - incompatible with [deadline scheduling](https://www.geeksforgeeks.org/deadline-scheduler-in-operating-system/) and [SMP affinity](https://cs.uwaterloo.ca/~brecht/servers/apic/SMP-affinity.txt)
    - systems with small # of threads (but usually DUMB is good enough)
- **Scalable wait_q implementation** (`CONFIG_WAITQ_SCALABLE`)
- **Simple linked-list wait_q** (`CONFIG_WAITQ_DUMB`)


## What if we don’t want all those threads? 

Zephyr IPC is about coordinating threads, so… skip the threads Works Queues: 
- Simple callbacks run in order (with optional timed delay)
- One manager thread per queue, lightweight 
- No need to decide on “until”, just insert the item when it’s ready to run ○ Actually stronger: must not spin, wait, sleep or otherwise delay the queue! 


Blocking (“pending” in Zephyr kernelese)
- Threads can’t be running all the time, need to be able to wait until 
- Implemented with a “wait queue” in the kernel ○ Simple list of threads, sorted in priority order 
- Must be called while holding a spinlock, which scheduler will release 
- Takes a “timeout” parameter 
- How long to wait until returning with -EAGAIN (or K_FOREVER) ○ K_NOWAIT: enables “nonblocking I/O” and use in ISRs 
- Essentially all Zephyr APIs that can block expose this timeout ○ Semi-unique Zephyr feature, other systems make timeouts API-specific ■ Unix select/poll has it, but read/write don’t, setsockopt(SO_RCVTIMEO), etc…
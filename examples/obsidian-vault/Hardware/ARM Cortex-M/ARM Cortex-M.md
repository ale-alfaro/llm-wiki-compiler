---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# ARM Cortex-M Knowledge 

## Background on ARM Cortex Family


Introduced in 2004, Cortex divided ARM cores into multiple segments:

**•	A - Application:**
	Intended for applications requiring high performance. These cores contain an MMU capable of running a complete Operating System. Some of the cores prioritize achieving the highest performance while others prioritize power efficiency.
	
•	**R - Real-time:**
	intended for applications requiring deterministic real-time responses

•	**M - Microcontrollers:**
	intended for cost-sensitive and low-power applications
	
This division into segments was used in the ARMv7 version of the architecture, although the first Cortex-M were based on the ARMv6-M architecture rather than ARMv7-M.

In the ARMv7 ISA, the Thumb 2 extension introduced in the ARMv6 version of the architecture was made mandatory. In the case of ARMv7-M, only the Thumb mode is supported, whereas ARMv7-A and ARMv7-R support both ARM and Thumb.


> [!warning] DO NOT USE ARM MODE IN CORTEX-M
> As mentioned above its simply not supported. It will cause a HardFault if attempted. More on [[ARM Instruction Set]]



---
## Vector table

Contains the initial Stack Pointer and Program Counter (i.e ResetHandler ) and the rest of the Exception function pointers. **After program startup it acts as a jump table for exceptions and interrupts **


The vector table contains the reset value of the stack pointer, and the start addresses for all exception and interrupt handlers. Figure below shows the order of the Cortex-M4 exception and interrupt vectors in the vector table.


![rtaImage 411×528 pixels](https://community.silabs.com/servlet/rtaImage?eid=ka01M000000gFpY&feoid=00N1M00000FHjri&refid=0EM1M000001gpaM)

In general, the vector table is fixed at address `0x00000000` on system reset. The privileged software can write to the VTOR register to relocate the vector table start address to a different memory location, in the range `0x00000080` to `0x3FFFFF80`.

Once an exception or interrupt is triggered, the processor automatically jumps to the corresponding address in the vector table which contains an address to the relevant exception or interrupt handlers (ISR).

For more information about each exception handler of the Cortex-M4, the reader is referred to the ARM Cortex-M4 Technical Reference Manual.

The location of the start address of the Vector table is not specified by ARM and therefore needs a register to locate it: the Vector Table Offset Register (VTOR)


| VTOR       | SP        | RST       | NMI       |          |
| ---------- | --------- | --------- | --------- | -------- |
| 0x20004000 | 0x800015D | 0x80002F5 | 0x80002FB | 080001E1 |
|            |           |           |           |          |
| 08000301   | 08000307  | 00000000  |           |          |
_Example VTOR with value 0x000000 and vector table_


The Vector Table must be 256 bytes algned so that the VTOR (Vector Table Offset Register) register can point to it successfully at the start of the program. 

The VTOR is located at memory address 0x0000000 and is used also during the execution of the program whenever the program hits an exception or  an interrupt  and the program needs to load the correct handler to deal with the exception/interrupt raised.

![[VECTOR TABLE.png]]


The diagram below shows the steps taken by the processor to handle a Vector Table exception. 

![[VTOR and Vector Table Workflow.png]]


This is extremely useful to know for [[Cortex-M Debug]] as whenever the hardfault exception is raised the **ADDRESS** of the offending instruction and the the stack frame at that point will be saved in the MSP or PSP (More on the stack and stack pointers in [[#Stack and Stack pointers]]) depending on what mode the CPU was at (more on  that in [[#Operation Modes ( Thread vs Handler)]]) was in at the point of the exception. 

---


## Operation Modes ( Thread vs Handler)

Two main modes (thread and handler modes) and two privilege levels (privileged and unprivileged) exist in ARM Cortex-M processor (except for M0+ which doesn't support privilege levels). Flow diagram below explains the flow on how the processor changes between modes and privilege levels in a  concise way:

![[OPERATIONS MODES.png]]

Thing that might be missed:

- Handler mode is **ONLY available during exception handler execution**
- 
- The CPU starts in thread mode privilege level

---
## Stack and Stack Pointers


| Stack Pointer               | Description                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| MSP (Main Stack Pointer)    | Stack pointer used when inside an exception handler and in handler mode |
| PSP (Process Stack Pointer) | Stack pointer used during the main execution of your program            |

---

![[ARM Instruction Set]]



---

## [[NVIC (Non-Volatile Interrupt Controller)]]

##   ARM Exception Model [Overview](https://interrupt.memfault.com/blog/arm-cortex-m-exceptions-and-nvic#arm-exception-model-overview)

An exception (or also referred to as an interrupt ) is defined in the ARM specification as 
> a condition that changes the normal flow of control in a program [^1]
[^1] [ARM Docs](https://interrupt.memfault.com/blog/arm-cortex-m-exceptions-and-nvic#fn:4)

 Exceptions are identified by the following pieces of information:

| Exception  Number                   | A unique number used to reference a particular exception (starting at **1**). This number is also used as the offset within the **Vector Table** where the address of the routine for the exception can be found. The routine is usually referred to as the **Exception Handler** or **Interrupt Service Routine** (**ISR**) and is the function which runs when the exception is triggered. The ARM hardware will automatically look up this function pointer in the **Vector Table** when an exception is triggered and start executing the code.               |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Priority Number                     | Each exception has a priority associated with it. For most exceptions this number is configurable. Counter-intuitively, the lower the priority number, the higher the precedence the exception has. So for example if an exception of priority level 2 and level 1 occur at the same time, the level 1 exception will be run first. When we say an exception has the “highest priority”, it will have the _lowest_ **Priority Number**. If two exceptions have the _same_ **Priority Number**, the exception with the lowest **Exception Number** will run first. |
| **Synchronous** or **Asynchronous** | As the name implies, some exceptions will fire immediately after an instruction is executed (i.e `SVCall`). These exceptions are referred to as _synchronous_. Exceptions that do not fire immediately after a particular code path is executed are referred to as _asynchronous                                                                                                                                                                                                                                                                                  |


An exception can be in one of several states:

- **Pending** - The MCU has detected the exception and scheduled it but has not yet invoked the handler for it.
- **Active** - The MCU has started to run the exception handler but not yet finished executing it. It’s possible for the exception to have been “pre-empted” by a higher priority handler and be in this state.
- **Pending & Active** - Only possible for asynchronous exceptions, this basically means the exception was detected by the MCU again while processing an earlier detected version of the same exception.
- **Inactive** - The exception is neither pending nor active.

> [!note] Even while an exception is disabled, it can still reach the **pending** state. Upon being enabled it will then transition to active. It’s generally a good idea to clear any pending exceptions for an interrupt before enabling it.

Let’s explore the different types of exceptions available on ARM Cortex-M MCUs:

### Built in Exceptions[](https://interrupt.memfault.com/blog/arm-cortex-m-exceptions-and-nvic#built-in-exceptions)

These are exceptions that are part of _every_ ARM Cortex-M core. The ARM Cortex-M specifications reserve **Exception Numbers** **1**-**15**, inclusive, for these.
![](https://interrupt.memfault.com/img/armv-m-exceptions/exception-numbers.png)


Out of the 15 **6 are required** :
- **Reset** - This is the routine executed when a chip comes out of reset. More details can be found within the [Zero to main() series of posts](https://interrupt.memfault.com/tag/zero-to-main).
- **Non Maskable Interrupt** (`NMI`) - As the name implies, this interrupt cannot be disabled. If errors happen in other exception handlers, a NMI will be triggered. Aside from the `Reset`exception, it has the highest priority of all exceptions.
- **HardFault** - The catchall for assorted system failures that can take place such as accesses to bad memory, divide-by-zero errors and illegal unaligned accesses. It’s the only handler for faults on the ARMv6-M architecture but for ARMv7-M & ARMv8-M, finer granularity fault handlers can be enabled for specific error classes (i.e `MemManage`, `BusFault`, `UsageFault`). [2](https://interrupt.memfault.com/blog/arm-cortex-m-exceptions-and-nvic#fn:3)
- **SVCall** - Exception handler invoked when an _Supervisor Call_ (`svc`) instruction is executed.
- **PendSV** & **SysTick** - System level interrupts triggered by software. They are typically used when running a RTOS to manage when the scheduler runs and when context switches take place.

### External Interrupts[](https://interrupt.memfault.com/blog/arm-cortex-m-exceptions-and-nvic#external-interrupts)

ARM cores also support interrupt lines which are “external” to the core itself. These interrupt lines are usually routed to vendor-specific peripherals on the MCU such as Direct Memory Access (**DMA**) engines or General Purpose Input/Output Pins (**GPIO**s). All of these interrupts are configured via a peripheral known as the _Nested Vectored Interrupt Controller_ (**NVIC**).

The **Exception Number** for external interrupts starts at **16**. The ARMv7-M reference manual has a good graphic which displays the Exception number mappings


---

## [[MPU (Memory Protrction Unit)]]

- What is an MPU[link](https://interrupt.memfault.com/blog/fix-bugs-and-secure-firmware-with-the-mpu)
- 
## References and more learning material

### Wadix Technologies Videos

- [ARM Cortex-M Youtube Channel - Wadix](https://youtube.com/@wadixtechnologies?si=QlS9fzGvOlqhu7qe)
### Memfault Articles

- Guide to Using ARM Stack Limit Registers [link](https://interrupt.memfault.com/blog/using-psp-msp-limit-registers-for-stack-overflow)
- Tools we use: installing GDB for [link](https://interrupt.memfault.com/blog/installing-gdb)
- Peeking inside CMSIS-Packs [link](https://interrupt.memfault.com/blog/cmsis-packs)
- Introduction to ARM Semihosting [link](https://interrupt.memfault.com/blog/arm-semihosting)
- ARM Cortex-M33 Instruction Tracing Without a Debugger [link](https://interrupt.memfault.com/blog/instruction-tracing-mtb-m33)
- Faster Debugging with Watchpoints[link](https://interrupt.memfault.com/blog/cortex-m-watchpoints)
- Step-through debugging with no debugger on Cortex-M [link](https://interrupt.memfault.com/blog/cortex-m-debug-monitor)
- How do breakpoints even work? [link](https://interrupt.memfault.com/blog/cortex-m-breakpoints)
- Profiling Firmware on Cortex-M[link ](https://interrupt.memfault.com/blog/profiling-firmware-on-cortex-m)
- A Guide to Watchdog Timers for Embedded Systems [link](https://interrupt.memfault.com/blog/firmware-watchdog-best-practices)
- How to debug a HardFault on an ARM Cortex [link](https://interrupt.memfault.com/blog/cortex-m-hardfault-debug)
-  From Zero to main(): Bootstrapping libc with Newlib[link](https://interrupt.memfault.com/blog/boostrapping-libc-with-newlib)
- ARM Cortex-M RTOS Context Switching [link](https://interrupt.memfault.com/blog/cortex-m-rtos-context-switching)
- A Practical guide to ARM Cortex-M Exception Handling [link](https://interrupt.memfault.com/blog/arm-cortex-m-exceptions-and-nvic)
- From Zero to main(): How to Write a Bootloader from Scratch [link](https://interrupt.memfault.com/blog/how-to-write-a-bootloader-from-scratch)
- A Deep Dive into ARM Cortex-M Debug Interfaces [link](https://interrupt.memfault.com/blog/a-deep-dive-into-arm-cortex-m-debug-interfaces)

[^1]: : https://interrupt.memfault.com/blog/arm-cortex-m-exceptions-and-nvic#fn:4).

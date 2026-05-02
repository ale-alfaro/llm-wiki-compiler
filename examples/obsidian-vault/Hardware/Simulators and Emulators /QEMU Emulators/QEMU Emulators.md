---
tags:
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# QEMU Emulators

> [!PDF|yellow] [[QEMU Introduction White Paper.pdf#page=1&selection=22,0,89,4|QEMU Introduction p.1]]\
> QEMU is a machine emulator: it can run an unmodified target operating system (such as Windows or Linux) and all its applications in a virtual machine. QEMU itself runs on several host operating systems such as Linux, Windows and Mac OS X.
>
> The host and target CPUs can be different. 
> 
> The primary usage of QEMU is to run one operating system on another, such as Windows on Linux or Linux on Windows.




QEMU is made of several subsystems: 

- CPU emulator (currently x861, PowerPC, ARM and Sparc) 
- Emulated devices (e.g. VGA display, 16450 serial port, PS/2 mouse and keyboard, IDE hard disk, NE2000 network card, ...) 
- Generic devices (e.g. block devices, character devices, network devices) used to connect the emulated devices to the corresponding host devices 
- Machine descriptions (e.g. PC, PowerMac, Sun4m) instantiating the emulated devices 
- Debugger 
- User interface 
- 


## Dynamic translator used by QEMU

The dynamic translator performs a runtime conversion of the target CPU instructions into the host instruction set. The resulting binary code is stored in a translation cache so that it can be reused. The advantage compared to an interpreter is that

## References

- QEMU introduction\
<https://www.usenix.org/legacy/event/usenix05/tech/freenix/full_papers/bellard/bellard.pdf>
- QEMU emulation of ADC peripheral in Zephyr [Video](https://youtu.be/prS3ROKxC5s?si=Ij56cYPF5w45tCYW)


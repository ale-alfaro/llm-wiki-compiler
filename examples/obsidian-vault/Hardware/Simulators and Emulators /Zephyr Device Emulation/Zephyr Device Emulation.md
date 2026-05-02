---
id: Simulators&Emulators
aliases:
  - native_sim
  - emulators
tags: []
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Overview

Zephyr includes in its codebase a set of device emulators/simulators.
With this we refer to SW components which are built together with the embedded SW
and present themselves as devices of a given class to the rest of the system.

These device emulators/simulators can be built for any target which has sufficient RAM and flash,
even if some may have extra functionality which is only available in some targets.

> [!NOTE] Zephyr also includes and uses many other types of simulators/emulators:
>
> - CPU simulators
> - Platform simulators: [[HOWTO - Native Sim|Native Sim]]
> 
> - Radio simulators ([[Babblesim]])
> - Hardware [[Bus_Drivers_Emulators|Emulators]] for drivers

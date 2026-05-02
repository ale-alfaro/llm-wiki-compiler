---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
## ARM Instruction Set: Thumb2 and ARM

EASY. Cortex-m only support ONE instruction set so there's not much to it:

- Thumb2 is only supported and not ARM instruction. 
- Thumb2 has the first bit set in its instruction set so it can easily be identified by that when reading 
- Clearing the bit and branching execution to go to ARM mode will result in HARDFAULT
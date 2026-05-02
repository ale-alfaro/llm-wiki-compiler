---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
## Overview
Controller mediates the hardware interrupts coming from the MCU peripherals (SPI, I2C, GPIOTE) and enables configurable interrupts (on/off) and interrupt priorities

![[NVIC OVERVIEW.jpeg.png]]

### States

4 main states exist:
- Active and Pending - ISR Active + next interrupt triggered
- Active - ISR Active
- Pending - Interrupt triggered but no ISR
- Inactive - No interrupt has been triggered 


# NVIC Registers

| Address                 | Name                    | Type | Required Privilege | Reset Value | Description                         |
| ----------------------- | ----------------------- | ---- | ------------------ | ----------- | ----------------------------------- |
| 0xE000E100 – 0xE000E11F | NVIC_ISER0 – NVIC_ISER7 | RW   | Privileged         | 0x00000000  | Interrupt set-enable registers      |
| 0xE000E180 – 0xE000E19F | NVIC_ICER0 – NVIC_ICER7 | RW   | Privileged         | 0x00000000  | Interrupt clear-enable registers    |
| 0xE000E200 – 0xE000E21F | NVIC_ISPR0 – NVIC_ISPR7 | RW   | Privileged         | 0x00000000  | Interrupt set-pending registers     |
| 0xE000E280 – 0xE000E29F | NVIC_ICPR0 – NVIC_ICPR7 | RW   | Privileged         | 0x00000000  | Interrupt clear-pending registers   |
| 0xE000E300 – 0xE000E31F | NVIC_IABR0 – NVIC_IABR7 | RW   | Privileged         | 0x00000000  | Interrupt active bit registers      |
| 0xE000E400 – 0xE000E4EF | NVIC_IPR0 – NVIC_IPR59  | RW   | Privileged         | 0x00000000  | Interrupt priority registers        |
| 0xE000EF00              | STIR                    | WO   | Configurable       | 0x00000000  | Software trigger interrupt register |
> [!tldr] 4 Main actions that are possible
> - Clearing Active (after servicing) or Pending Interrupts
> - Triggerring Interrupts 
> - Configure interrupts priorities
> - Enable/Disable interrupt lines
>m
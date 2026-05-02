---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

## Kconfig to optimize for size

```
# Drivers and peripherals
CONFIG_I2C=n
CONFIG_WATCHDOG=n
CONFIG_GPIO=n
CONFIG_PINCTRL=n
CONFIG_SPI=n
CONFIG_FLASH=n
CONFIG_UART_USE_RUNTIME_CONFIGURE=n
CONFIG_UART_INTERRUPT_DRIVEN=n
# libc
CONFIG_MINIMAL_LIBC=y
CONFIG_CBPRINTF_NANO=y
CONFIG_CBPRINTF_REDUCED_INTEGRAL=y
CONFIG_CBPRINTF_LIBC_SUBSTS=n
CONFIG_PRINTK=n
CONFIG_EARLY_CONSOLE=n
CONFIG_BOOT_BANNER=n
CONFIG_MINIMAL_LIBC_OPTIMIZE_STRING_FOR_SIZE=y
CONFIG_MINIMAL_LIBC=y
```

## Compiler Optimization Kconfig

```kconfig
CONFIG_SIZE_OPTIMIZATIONS=y
# CONFIG_SIZE_OPTIMIZATIONS_AGGRESSIVE is not set
# CONFIG_SPEED_OPTIMIZATIONS is not set
```

Oz:
	Optimize aggressively for size rather than speed. This may increase the number of instructions cuted ifthose instructions require fewer bytes to encode. -Oz behaves similarly to -0s including
enabling most -02 optimizations.


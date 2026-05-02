---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
Zephyr Getting Started Series: <https://interrupt.memfault.com/authors/lampacher/>

Watch next <https://youtu.be/sWaxQyIgEBY?si=vDVoF7yfmhEOF-uN>

#### Device Tree explained

[Video](https://youtu.be/w8GgP3h0M8M?si=7r1bF3OlRC4FiXAu)

DTS (device tree specification ):

- Define all possible devices in its own language

Bindings:

- Converts device tree node to a C struct

![[Zephyr5.png]]

**Device tree generated files:**

```c title:generated_files


/*The preprocessed DTS source. This is an intermediate output file, which is input to `gen_defines.py` and used to create `zephyr.dts` and `devicetree_generated.h`. */
<build>/zephyr/zephyr.dts.pre

/*The generated macros and additional comments describing the devicetree. Included by `devicetree.h`.*/
<build>/zephyr/include/generated/zephyr/devicetree_generated.h


/*The final merged devicetree. This file is output by `gen_defines.py`. It is useful for debugging any issues. If the devicetree compiler `dtc` is installed, it is also run on this file, to catch any additional warnings or errors.*/
<build>/zephyr/zephyr.dts

/*
Additional generated files
- ﻿﻿devicetree_fixups.h: legacy
- ﻿﻿devicetree_unfixed.h: your DTS, in C
- ﻿﻿devicetree_extern.h: possible DTS devices
*/
```

The `gen_defines.py` generator is the first unit to process dts files and generates 3
different files:

```
-- Generated zephyr.dts: /path/to/build/zephyr/zephyr.dts
-- Generated devicetree_generated.h: /path/to/build/zephyr/include/generated/devicetree_generated.h
-- Including generated dts.cmake file: /path/to/build/zephyr/dts.cmake
```

#### zephyr.dts → devicetree_extern.h

How the header looks like:

```c devicetree_extern_example
extern const struct device[]={
DEVICE_DT_NAME_GET (DT_N),/* dts_ord_0 */
DEVICE_DT_NAME_GET(DT_N_S_aliases), /* dts_ord_1 */
/*...*/
DEVICE_DT_NAME_GET (DT_N_S_leds_S_led_0), /* dts_ord_19 */
DEVICE_DT_NAME_GET (DT_N_S_leds_S_led_1) /* dts_ord_20 */
};

extern const struct device ___device_dts_ord_0, __device_dts_ord_1,
/*...*/
_device_dts_ord_19, __device_dts_ord_20;
```

```c title:build/zephyr/include/generated/devicetree_generated.h
#define DT_CHOSEN_zephyr_console DT_N_S_soc_S_uart_40002000
// --snip---
#define DT_N_S_soc_S_uart_40002000_P_current_speed 115200
#define DT_N_S_soc_S_uart_40002000_P_status "okay"
```

- `DT_` is just the common prefix for Devicetree macros,

- `_S_` is a forward slash `/`,

- `_N_` refers to a *node*,

- `_P_` is a *property*.

- ﻿﻿Lowercase-and-underscore everything from DTS

Thus, e.g., `DT_N_S_soc_S_uart_40002000_P_current_speed` simply refers to the *property*
`current_speed` of the *node* `/soc/uart_40002000`.

![[Zephyr3.png]]

![[Zephyr2.png]]

- ﻿﻿‹node_id>_P_baz: property baz value

- ﻿﻿Types from bindings

- ﻿﻿Take only what you need

For all generated macro tokens look at :
[http://cs.zephyrproject.org/3.1.0/build/dts/api-usage.html#generated-macros](http://cs.zephyrproject.org/3.1.0/build/dts/api-usage.html#generated-macros)

#### undefined reference to __device_dts_ord_105

- Look up node with ordinal 105 in devicetree_unfixed.h

- ﻿﻿Find driver that should allocate the device node

- ﻿﻿Is driver Kconfig y?

- ﻿﻿Is the node enabled?

#### _device_dts_ord_DT_HOT_MESS

![[Zephyr1.jpg]]

Look at the preprocessor output

To save preprocessor output when using GCC-based toolchains, add -save-temps=ob) to the
EXTRA_CFLAGS CMake variable.
For example, to build Hello World with west with this option set, use:

```bash
west build -b BOARD samples/hello_world -DEXTRA_CFLAGS=“save-temps=obj”
```

This will create a preprocessor output file named foo,c.1 in the build directory for
each source file foo.c.

You can then search for the file in the build directory to see what your devicetree
macros expanded to. For example, on macOS and Linux, using find to find main.c.11

```bash
find build -name main.c.i

build/CMakefiles/app.dir/src/main.c.i
```

It’s usually easiest to run a style formatter on the results before opening them.
For example, to use clang-format to reformat the file in place:

```bash
clang-format -i build/CMakeFiles/app.dir/src/main.c.i
```

You can then open the file in your favorite editor to view the final C results after
preprocessing.

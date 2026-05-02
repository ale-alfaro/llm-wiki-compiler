---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#### Resources

- Kconfig spec from Linux kernel:
  <https://www.kernel.org/doc/html/latest/kbuild/kconfig-language.html>

- Great article on Zephyr Kconfig:
  <https://interrupt.memfault.com/blog/practical_zephyr_kconfig>

- [VS Code Kconfig LSP](https://github.com/trond-snekvik/vscode-kconfig):

  - Implemented in TypeScript.
    Has been deprecated for the Nordic VS code extension

  - Supports most the Zephyr features except macros

## Kconfig hardening[](https://interrupt.memfault.com/blog/practical_zephyr_kconfig#kconfig-hardening)

Another tool worth mentioning when talking about *Kconfig* is the
[hardening tool](https://docs.zephyrproject.org/latest/security/hardening-tool.html).
Just like `menuconfig` and `guiconfig`, this tool is a target for `west build`. It is
executed using the `-t hardenconfig` target in the call to `west build`. The hardening
tool checks the *Kconfig* symbols against a set of known configuration options that
should be used for a secure Zephyr application.
It then lists all differences found in the application.

We can use this tool to check our normal and *release* configurations:

```
$ # test normal build
$ west build --board nrf52840dk_nrf52840 \
  -d ../build \
  --pristine \
  -t hardenconfig

$ # test release build
$ west build --board nrf52840dk_nrf52840 \
  -d ../build \
  --pristine \
  -t hardenconfig \
  -- -DCONF_FILE=prj_release.conf
```

For the normal build using `prj.conf`, the hardening tool displays a table of all
symbols whose current values do not match the recommended, secure configuration value.
E.g., at the time of writing, this is the output for the normal build in my demo
application:

```
-- west build: running target hardenconfig
[0/1] cd /path/to/zephyr/kconfig/hardenconfig.py /opt/nordic/ncs/v2.4.0/zephyr/Kconfig
                 name                 | current | recommended || check result
==============================================================================
CONFIG_OVERRIDE_FRAME_POINTER_DEFAULT |    n    |      y      ||     FAIL
CONFIG_USE_SEGGER_RTT                 |    y    |      n      ||     FAIL
CONFIG_BUILD_OUTPUT_STRIPPED          |    n    |      y      ||     FAIL
CONFIG_FAULT_DUMP                     |    2    |      0      ||     FAIL
CONFIG_STACK_SENTINEL                 |    n    |      y      ||     FAIL
```

### Project wide Kconfig

[ CMake automatically detects a `Kconfig`
file](https://docs.zephyrproject.org/latest/develop/application/index.html#application-cmakelists-txt)
if it is placed in the same directory of the application’s `CMakeLists.txt`, and that is
what we’ll use for our own configuration file.
If you want to place the `Kconfig` file somewhere else, you can customize this behavior
using an absolute path for the `KCONFIG_ROOT` build system variable.

The *“source”* statement essentially includes the top-level Zephyr Kconfig file
`zephyr/Kconfig.zephyr` and all of its symbols (all *“source”* statements are relative
to Zephyr’s root directory).
This is necessary since we’re effectively replacing the `zephyr/Kconfig` file of the
Zephyr base that is usually *parsed* as the first file by *Kconfig*. We’ll see this
below when we look at the build output.
The contents of the default root `Kconfig` file are quite similar to what we’re doing
right now:

```
$ cat $ZEPHYR_BASE/Kconfig
# -- hidden comments --
mainmenu "Zephyr Kernel Configuration"
source "Kconfig.zephyr"
```

By sourcing the `Kconfig.zephr` file, we’re loading all *Kconfig* menus and symbols
provided with Zephr.
Next, we declare our own menu between the *“menu”* and *“endmenu”* statements to group
our application symbols.
Within this menu, we declare our `USR_FUN` symbol, which we’ll use to enable a function
`usr_fun`.

```
Parsing /path/to/01_kconfig/Kconfig
Loaded configuration '/opt/nordic/ncs/v2.4.0/zephyr/boards/arm/nrf52840dk_nrf52840/nrf52840dk_nrf52840_defconfig'
Merged configuration '/path/to/01_kconfig/prj.conf'
Merged configuration '/path/to/01_kconfig/boards/nrf52840dk_nrf52840.conf'
Configuration saved to '/path/to/build/zephyr/.config'
Kconfig
```

Have a good look at the very first line of the *Kconfig*-related output:

- In our previous builds, this line indicated the use of Zephyr’s default `Kconfig` file
  as follows: `Parsing /opt/nordic/ncs/v2.4.0/zephyr/Kconfig`,

- Whereas now it uses our newly created `Kconfig` file: `Parsing
  /path/to/01_kconfig/Kconfig`.

### Kconfig to Macro

Within the large list of parameters passed to the compiler, there is also the `-imacros`
option specifying the `autoconf.h` Kconfig header file:

```
-imacros /path/to/build/zephyr/include/generated/autoconf.h
```

This header file contains the configured value of the `USR_FUN` symbol as a macro:

```
// --snip---
#define CONFIG_USR_FUN 1
```

Looking at the [official documentation of the `-imacros` option for
`gcc`](https://gcc.gnu.org/onlinedocs/gcc/Preprocessor-Options.html), you’ll find that
this option acquires all the macros of the specified header without also processing its
declarations.
Thus, all macros within the `autoconf.h`files are also available at compile
time.

Zephyr enables the _CMake_variable
[`CMAKE_EXPORT_COMPILE_COMMANDS`](https://cmake.org/cmake/help/latest/variable/CMAKE_EXPORT_COMPILE_COMMANDS.html).
The compiler command for `main.c` is thus captured by the `compile_commands.json` in our
build directory:

```
{
  "directory": "/path/to/build",
  "command": "/path/to/bin/arm-zephyr-eabi-gcc --SNIP-- -o CMakeFiles/app.dir/src/main.c.obj -c /path/to/main.c",
  "file": "/path/to/main.c"
},
```

This is useful for debugging Kconfig build issues

![[Kconfig 044-050 1.pdf]]

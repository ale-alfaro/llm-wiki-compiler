---
tags: []
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---


## Compiling

To build, simply specify the `native_sim` board as target:

```sh
west build -b native_sim samples/hello_world
```

## Running

The result of the compilation is an executable (`zephyr.exe`) placed in the `zephyr/` subdirectory of the `build` folder. Run the `zephyr.exe` executable as you would any other Linux console application.

```sh
$ ./build/zephyr/zephyr.exe
```

> [!info] Press Ctrl+C to exit

This executable accepts several command line options depending on the compilation configuration. You can run it with the `--help` command line switch to get a list of available options.

```sh
$ ./build/zephyr/zephyr.exe --help
```

Note that the Zephyr kernel does not actually exit once the application is finished. It simply goes into the idle loop forever. Therefore you must stop the application manually (Ctrl+C in Linux).

Application tests using the [ztest framework](https://docs.zephyrproject.org/latest/develop/test/ztest.html#test-framework) will exit after all tests have completed.

If you want your application to gracefully finish when it reaches some point, you may add a conditionally compiled ([`CONFIG_ARCH_POSIX`](https://docs.zephyrproject.org/latest/kconfig.html#CONFIG_ARCH_POSIX "CONFIG_ARCH_POSIX")) call to `nsi_exit(int status)` at that point.

## Debugging

Since the Zephyr executable is a native application, it can be debugged and instrumented as any other native program. The program is compiled with debug information, so it can be run directly in, for example, `gdb` or instrumented with `valgrind`.

Because the execution of your Zephyr application is normally deterministic (there are no asynchronous or random components), you can execute the code multiple times and get the exact same result. Instrumenting the code does not affect its execution.

To ease debugging you may want to compile your code without optimizations (e.g., `-O0`) by setting [`CONFIG_NO_OPTIMIZATIONS`](https://docs.zephyrproject.org/latest/kconfig.html#CONFIG_NO_OPTIMIZATIONS "CONFIG_NO_OPTIMIZATIONS").

For ease of debugging consider using an IDE as GUI for your debugger.

## Address Sanitizer (ASan)

You can also build Zephyr with the [Address Sanitizer](https://github.com/google/sanitizers/wiki/AddressSanitizer). To do this, set [`CONFIG_ASAN`](https://docs.zephyrproject.org/latest/kconfig.html#CONFIG_ASAN "CONFIG_ASAN"), for example, in the application project file, or in the `west build` or `cmake` command line invocation.

Note that you will need the ASan library installed in your system. In Debian/Ubuntu this is `libasan1`.

## Undefined Behavior Sanitizer (UBSan)

You can also build Zephyr with the [Undefined Behavior Sanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html). To do this, set [`CONFIG_UBSAN`](https://docs.zephyrproject.org/latest/kconfig.html#CONFIG_UBSAN "CONFIG_UBSAN"), for example, in the application project file, or in the `west build` or `cmake` command line invocation.

## Coverage Reports

See [coverage reports using the POSIX architecture](https://docs.zephyrproject.org/latest/develop/test/coverage.html#coverage-posix).

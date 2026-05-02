---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Kconfig Tooling

## Menuconfig

## GUIConfig

## Traceconfig

## Kconfig hardening[](https://interrupt.memfault.com/blog/practical_zephyr_kconfig#kconfig-hardening)

Another tool worth mentioning when talking about _Kconfig_ is the
[hardening tool](https://docs.zephyrproject.org/latest/security/hardening-tool.html).
Just like `menuconfig` and `guiconfig`, this tool is a target for `west build`. It is
executed using the `-t hardenconfig` target in the call to `west build`. The hardening
tool checks the _Kconfig_ symbols against a set of known configuration options that
should be used for a secure Zephyr application.
It then lists all differences found in the application.

We can use this tool to check our normal and _release_ configurations:

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

## Other Tools

- [VS Code Kconfig LSP](https://github.com/trond-snekvik/vscode-kconfig):
  - Implemented in TypeScript.
    Has been deprecated for the Nordic VS code extension

  - Supports most the Zephyr features except macros

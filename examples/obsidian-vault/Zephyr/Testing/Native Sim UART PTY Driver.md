---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
[Zephyr docs](https://docs.zephyrproject.org/latest/boards/native/native_sim/doc/index.html)

Read on
[TTY/PTY](https://www.howtogeek.com/428174/what-is-a-tty-on-linux-and-how-to-use-the-tty-command/)
related stuff

```rst
PTY UART

This driver is automatically enabled when devicetree contains nodes with the "zephyr,native-pty-uart" compatible property and okay status and CONFIG_SERIAL is set. By default one ready UART of this type is setup in DTS, but any number can be enabled as desired.

Normally these UARTs are connected to new pseudoterminals PTYs, i.e. /dev/pts<nbr>, but it is also possible to map one of them to the executable’s stdin and stdout. This can be done in two ways, either with the command line option --<uart_name>_stdinout (where <uart_name> is the UART DTS node name), or, for the first PTY UART instance by chosing CONFIG_UART_NATIVE_PTY_0_ON_STDINOUT instead of the default CONFIG_UART_NATIVE_PTY_0_ON_OWN_PTY. For interactive use with the Shell, it is recommended to choose the PTY option. The STDINOUT option can be used for automated testing, such as when piping other processes’ output to control it. This is because the shell subsystem expects access to a raw terminal, which (by default) a normal Linux terminal is not.

When a UART is connected to a new PTY, the name of the newly created UART pseudo-terminal will be displayed in the console. If you want to interact with it manually, you should attach a terminal emulator to it. This can be done, for example with the command:

$ xterm -e screen /dev/<ptyn> &
# Or if you prefer gnome-terminal:
$ gnome-terminal -- screen /dev/<ptyn> &

where /dev/<ptyn> should be replaced with the actual PTY device.

You may also chose to automatically attach a terminal emulator to any of these UARTs. To automatically attach one to all these UARTs, pass the command line option -attach_uart to the executable. To automatically attach one to a single UART use -<uart_name>_attach_uart. The command used for attaching to the new shell can be set for all UARTs with the command line option -attach_uart_cmd=<"cmd">, or for each individual UART with -<uart_name>_attach_uart_cmd. Where the default command is given by CONFIG_UART_NATIVE_PTY_AUTOATTACH_DEFAULT_CMD. Note that the default command assumes both xterm and screen are installed in the system.

Note that these uart_cmd commands can be effectively any shell command including lists of commands. Therefore it is possible to invoke any other script or program from it. Those commands will be run right after the PTY is created. For example, if one wanted to create a link to the newly created PTY, and have it removed when the program ends, one could do:

$ zephyr.exe --uart_attach_uart_cmd='ln -s %s /tmp/somename' ; rm /tmp/somename

This driver supports poll mode, interrupt mode and async mode. Neither runtime configuration or line control are supported.
```

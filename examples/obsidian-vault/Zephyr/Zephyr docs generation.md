---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Zephyr Custom Directives and Rolex

[zephyr docs](https://docs.zephyrproject.org/latest/contribute/documentation/guidelines.html#custom-sphinx-roles-and-directives)


<iframe 
  id="inlineFrameExample"
  title="Inline Frame Example"
  width="1000"
  height="500"
  src="https://docs.zephyrproject.org/latest/contribute/documentation/guidelines.html#custom-sphinx-roles-and-directives"
  </iframe>

## Application Build Cmds

```rst
.. zephyr-app-commands::
Generate consistent documentation of the shell commands needed to manage (build, flash, etc.) an application

For example, to generate commands to build samples/hello_world for qemu_x86 use:

.. zephyr-app-commands::
   :zephyr-app: samples/hello_world
   :board: qemu_x86
   :goals: build

```

This will render as:
> # From the root of the zephyr repository
> west build -b qemu_x86 samples/hello_world


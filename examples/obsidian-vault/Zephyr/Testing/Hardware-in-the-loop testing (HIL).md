---
aliases:
  - Test Automation in Zephyr
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#automation #testing #hil-testing

## References:

- [[../../../res/Clippings/Automated hardware testing using pytest]]

- [[../../../res/Clippings/Github/espressif pytest-embedded A pytest plugin that designed for embedded testing]]

- [[Hardware-in-the-loop testing (HIL)|Test Automation in Zephyr]]

- [Goliath HIL blogs](https://blog.golioth.io/tag/hardware-in-the-loop/)

- [Example of doing cycle
  testing](https://jumptuck.com/blog/2024-02-10-twister-device-testing/)

Pytest plugin project with board classes abstracting the device HW:

- Golioth has
  [non-zephyr boards](https://github.com/golioth/golioth-firmware-sdk/tree/main/tests/hil/scripts/pytest-hil/pytest_hil)
  and use async (with anyio)

- [Zephyr](https://github.com/zephyrproject-rtos/zephyr/tree/main/scripts/pylib/pytest-twister-harness)
  has 3 simple board implementations

  - HW

  - Native Sim

  - QEMU

- [TwisterV2](https://github.com/zephyrproject-rtos/twister/blob/main/src/twister2/device/hardware_adapter.py)

  - Got archived but still has interesting code that isn’t in the Zephyr main repo

- Zephyr-testing repo.
  seems like a R&D repo that is ahead of the main branch?
  ^ca13ae

  - [ConfigReader](https://github.com/zephyrproject-rtos/zephyr-testing/blob/main/scripts/pylib/pytest-twister-harness/src/twister_harness/helpers/config_reader.py)
    utility - Should Import to Project!
    -
    [GitHub](https://github.com/zephyrproject-rtos/zephyr/blob/main/scripts/pylib/pytest-twister-harness/src/twister_harness/helpers/config_reader.py)

- ![[]]

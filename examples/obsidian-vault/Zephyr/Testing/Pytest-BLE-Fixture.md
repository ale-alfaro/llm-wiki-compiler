---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Pytest BLE Fixture

At the moment McuMgr BLE is the only fixture that is supported out of the box by Zephyr.

## References

- [Pytest Integration with Zephyr Test Framework](https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/develop/test/pytest.html)
- [Example Setup of Pytest](https://blog.golioth.io/automated-hardware-testing-using-pytest/)
- [Zephyr Pytest Sample](https://docs.zephyrproject.org/latest/samples/subsys/testsuite/pytest/shell/README.html#pytest_shell)
- [Python SMP/McuMgr Integration Github Issue](https://github.com/zephyrproject-rtos/zephyr/issues/70871)

## Tools for McuMgr/SMP Fixtures

## Python Dependencies for Pytest

```bash
pip install pytest anyio trio pyserial

# This one is used to program Nordic devices
pip install pynrfjprog
```

## McuMgr/SMP Python Lib

<https://github.com/intercreate/smpmgr>

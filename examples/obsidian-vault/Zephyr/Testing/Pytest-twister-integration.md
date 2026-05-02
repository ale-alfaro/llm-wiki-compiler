---
id: Pytest-twister-integration
aliases: []
tags:
  - pytest
  - twister
  - zephyr
  - testing
  - hil
  - python
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Overview

Integration is done through a plugin called pytest-twister-harness that lives inside the
Zephyr repo (inside scripts/pylib/pytest_twister_harness). It is recommended to run it
by modifying the `PYTHONPATH` to include the directory where the plugin lives and then
call the plugin in pytest with the `-p twister_harness.plugin` option to enable it.
But to edit and develop with it easily it’s best to install it in a venv.
Twister will nag at you for doing that, to silence it use `--allow-installed-plugin`
when calling twister

> Pytest-based test suites are discovered the same way as other twister tests, i.e., by
> a presence of test/sample.yaml.
> [^1] Inside, a keyword harness tells twister how to handle a given test.
> In the case of harness: pytest, most of twister workflow (test suites discovery,
> parallelization, building and reporting) remains the same as for other harnesses.
> The change happens during the execution step.
> The below picture presents a simplified overview of the integration.

![Architecture
Diagram](https://docs.zephyrproject.org/latest/_images/twister_and_pytest.svg)

# Configuration

```rst
pytest_root: <list of pytest testpaths> (default pytest)
```

Specify a list of pytest directories, files or subtests that need to be executed when a
test scenario begins to run.
The default pytest directory is pytest.
After the pytest run is finished, Twister will check if the test scenario passed or
failed according to the pytest report.
As an example, a list of valid pytest roots is presented below:

```yaml
    harness_config:
      pytest_root:
        - "pytest/test_shell_help.py"
        - "../shell/pytest/test_shell.py"
        - "/tmp/test_shell.py"
        - "~/tmp/test_shell.py"
        - "$ZEPHYR_BASE/samples/subsys/testsuite/pytest/shell/pytest/test_shell.py"
        - "pytest/test_shell_help.py::test_shell2_sample"  # select pytest subtest
        - "pytest/test_shell_help.py::test_shell2_sample[param_a]"  # select pytest parametrized subtest
```

```rst
pytest_args: <list of arguments> (default empty)
```

Specify a list of additional arguments to pass to pytest e.g.: pytest_args:
[‘-k=test_method’, ‘--log-level=DEBUG’]. Note that --pytest-args can be passed multiple
times to pass several arguments to the pytest.
```

```rst
pytest_dut_scope: <function|class|module|package|session> (default function)
```

The scope for which dut and shell pytest fixtures are shared.
If the scope is set to function, DUT is launched for every test case in python script.
For session scope, DUT is launched only once.

The following is an example yaml file with pytest harness_config options, default
pytest_root name “pytest” will be used if pytest_root not specified.
please refer the examples in samples/subsys/testsuite/pytest/.

```yaml
    common:
      harness: pytest
    tests:
      pytest.example.directories:
        harness_config:
          pytest_root:
            - pytest_dir1
            - $ENV_VAR/samples/test/pytest_dir2
      pytest.example.files_and_subtests:
        harness_config:
          pytest_root:
            - pytest/test_file_1.py
            - test_file_2.py::test_A
            - test_file_2.py::test_B[param_a]
```

Additional options can be passed through the CLI too with the --pytest-args flag:
```sh
./scripts/twister --platform native_sim -T samples/subsys/testsuite/pytest/shell \
-s samples/subsys/testsuite/pytest/shell/sample.pytest.shell \
--pytest-args='-k test_shell_print_version'
```

**The command options take precedence over the YAML ones**

## Reference

Options for pytest added by the Twister plugin:

```python
def pytest_addoption(parser: pytest.Parser):
    twister_harness_group = parser.getgroup('Twister harness')
    twister_harness_group.addoption(
        '--twister-harness',
        action='store_true',
        default=False,
        help='Activate Twister harness plugin.'
    )
    parser.addini(
        'twister_harness',
        'Activate Twister harness plugin',
        type='bool'
    )
    twister_harness_group.addoption(
        '--base-timeout',
        type=float,
        default=60.0,
        help='Set base timeout (in seconds) used during monitoring if some '
             'operations are finished in a finite amount of time.'
    )
    twister_harness_group.addoption(
        '--flash-timeout',
        type=float,
        default=60.0,
        help='Set timeout for device flashing (in seconds).'
    )
    twister_harness_group.addoption(
        '--build-dir',
        metavar='PATH',
        help='Directory with built application.'
    )
    twister_harness_group.addoption(
        '--device-type',
        choices=('native', 'qemu', 'hardware', 'unit', 'custom'),
        help='Choose type of device (hardware, qemu, etc.).'
    )
    twister_harness_group.addoption(
        '--platform',
        help='Name of used platform (qemu_x86, nrf52840dk/nrf52840, etc.).'
    )
    twister_harness_group.addoption(
        '--device-serial',
        help='Serial device for accessing the board (e.g., /dev/ttyACM0).'
    )
    twister_harness_group.addoption(
        '--device-serial-baud',
        type=int,
        default=115200,
        help='Serial device baud rate (default 115200).'
    )
    twister_harness_group.addoption(
        '--runner',
        help='Use the specified west runner (pyocd, nrfjprog, etc.).'
    )
    twister_harness_group.addoption(
        '--runner-params',
        action='append',
        help='Use the specified west runner params.'
    )
    twister_harness_group.addoption(
        '--device-id',
        help='ID of connected hardware device (for example 000682459367).'
    )
    twister_harness_group.addoption(
        '--device-product',
        help='Product name of connected hardware device (e.g. "STM32 STLink").'
    )
    twister_harness_group.addoption(
        '--device-serial-pty',
        help='Script for controlling pseudoterminal.'
    )
    twister_harness_group.addoption(
        '--flash-before',
        type=bool,
        help='Flash device before attaching to serial port'
             'This is useful for devices that share the same port for programming'
             'and serial console, or use soft-USB, where flash must come first.'
    )
    twister_harness_group.addoption(
        '--west-flash-extra-args',
        help='Extend parameters for west flash. '
             'E.g. --west-flash-extra-args="--board-id=foobar,--erase" '
             'will translate to "west flash -- --board-id=foobar --erase".'
    )
    twister_harness_group.addoption(
        '--pre-script',
        metavar='PATH',
        help='Script executed before flashing and connecting to serial.'
    )
    twister_harness_group.addoption(
        '--post-flash-script',
        metavar='PATH',
        help='Script executed after flashing.'
    )
    twister_harness_group.addoption(
        '--post-script',
        metavar='PATH',
        help='Script executed after closing serial connection.'
    )
    twister_harness_group.addoption(
        '--dut-scope',
        choices=('function', 'class', 'module', 'package', 'session'),
        help='The scope for which `dut` and `shell` fixtures are shared.'
    )
    twister_harness_group.addoption(
        '--twister-fixture', action='append', dest='fixtures', metavar='FIXTURE', default=[],
        help='Twister fixture supported by this platform. May be given multiple times.'
    )
    twister_harness_group.addoption(
        '--extra-test-args',
        help='Additional args passed to the test binary'
    )
```

# Fixtures

Not super useful except for the `unlaunched_dut` fixture and perhaps the `mcumgr` one
for OTA testing

- `dut` : This is the entry-point for the fixtures below except the `unlaunched_dut`.
  Has the Kconfig information for the FW and a useful helper can be used to extract
  specific info from it `ConfigReader`

- `shell` : Adds shell capabilities on top of the `dut` fixture such as executing
  commands and then expecting output.
  Uses regexes to validate output

- `mcumgr` : Literally is the `mcumgr` cli written in Go.
  Good for OTA and simple to use

- `unlaunched_dut` : Difference between this and the `dut` fixture is that this one
  comes pre-flashing and connecting to the devices serial port.
  This is the one to use to customize and extend

## Fixture scopes

Important to know the fixtures lifetime.
The Pytest Fixture [ Scopes
](https://docs.pytest.org/en/stable/how-to/fixtures.html#scope-sharing-fixtures-across-classes-modules-packages-or-session)
determine that and can be one of the following:

- function: the default scope, the fixture is destroyed at the end of the test.

- class: the fixture is destroyed during teardown of the last test in the class.

- module: the fixture is destroyed during teardown of the last test in the module.

- package: the fixture is destroyed during teardown of the last test in the package
  where the fixture is defined, including sub-packages and sub-directories within it.

- session: the fixture is destroyed at the end of the test session.

By default fixtures are scoped to a **function** which is terribly inefficient when
working with fixtures that exercise hardware and have a long setup.
The most useful to use in that case is the `session` scope or the `class` scope if using
a class to organize your tests

By default the `dut` fixture and similar ones are scoped to a `function` too.
If using them for several tests, specially if using the `dut` fixture that flashes the
application, changing the scope to another one is easy through the test.yaml:

```yaml
harness: pytest
harness_config:
   pytest_dut_scope: session
```

More on Twister:

- [[Twister - Test Runner|twister - Test Runner]]

Pytest:

- [[Pytest Configuration Options]]

- [[Pytest Fixtures]]

[^1]: The official zephyr docs go into more detail about YAML spec for Twister and
    pytest


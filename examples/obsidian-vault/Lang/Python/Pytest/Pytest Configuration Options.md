---
id: Pytest Configuration Options
aliases: []
tags:
  - python
  - testing
  - pytest
  - reference
  - config
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Configuration file formats

## pytest.ini

pytest.ini files take precedence over other files, even when empty.

Alternatively, the hidden version .pytest.ini can be used.

```ini
[pytest]
minversion = 6.0
addopts = -ra -q
testpaths =
    tests
    integration
```
## pyproject.toml

pyproject.toml are considered for configuration when they contain a
tool.pytest.ini_options table.

```toml
[tool.pytest.ini_options]
minversion = "6.0"
addopts = "-ra -q"
testpaths = [
    "tests",
    "integration",
]
```
# Config File Options

Configuration options may be overwritten in the command-line by using -o/--override-ini,
which can also be passed multiple times.
The expected format is name=value.
For example:

```sh
pytest -o console_output_style=classic -o cache_dir=/tmp/mycache
```
## pythonpath

Sets list of directories that should be added to the python search path

```toml
[pytest]
pythonpath = src1 src2
```

## addopts

Add the specified OPTS to the set of command line arguments as if they had been
specified by the user.
## markers

When the `--strict-markers` command-line arguments is used, only known markers - defined
in code by core pytest or some plugin - are allowed.

You can list additional markers in this setting to add them to the whitelist, in which
case you probably want to add --strict-markers to addopts to avoid future regressions:

```toml
[pytest]
addopts = --strict-markers
markers =
    slow
    serial
```

## usefixtures

List of fixtures that will be applied to all test functions; this is semantically the
same to apply the `@pytest.mark.usefixtures` marker to all test functions.
```toml
[pytest]
usefixtures =
    clean_db
```
## Logging Options

### log_cli

Enable log display during test run (also known as “live logging”). The default is False.

```toml
[pytest]
log_cli = True
log_cli_format = "%(asctime)s %(levelname)s %(message)s"
log_cli_level = "INFO"


log_file = "logs/pytest-logs.txt"
log_file_mode = "a"
log_file_format = ...
log_file_level = ...

log_level = "INFO"
```

## Command Line Args and Flags

```toml
  -r chars
  Show extra test summary info as specified by chars:
                        (f)ailed, (E)rror, (s)kipped, (x)failed, (X)passed,
                        (p)assed, (P)assed with output, (a)ll except passed
                        (p/P), or (A)ll. (w)arnings are enabled by default
                        (see --disable-warnings), 'N' can be used to reset
                        the list. (default: 'fE').
```

| Opt | Description |
| --- | --- |
| Strict-markers | Markers not registered in the `markers` section of the configuration file raise errors |
|  |  |

Full [list](https:/docs.pytest.org/en/stable/reference/reference.html) of options

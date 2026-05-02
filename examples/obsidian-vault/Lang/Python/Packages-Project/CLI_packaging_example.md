---
id: CLI_packaging_example
aliases: []
tags:
  - python
  - uv
  - packaging
  - pyproject
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
## Creating and packaging command-line tools

This guide will walk you through creating and packaging a standalone command-line
application that can be installed with `pipx`, a tool for creating and managing `Python
Virtual Environments <Virtual Environment>` and exposing the executable scripts of
packages (and available manual pages) for use on the command-line.

### Creating the package

First of all, create a source tree for the `project <Project>`{.interpreted-text
role="term"}. For the sake of an example, we\'ll build a simple tool outputting a
greeting (a string) for a person based on arguments given on the command-line.

This project will adhere to[[The_src_layout]] and in the end be alike this file tree,
with the top-level folder and package name `greetings`:

```
.
├── pyproject.toml
└── src
    └── greetings
        ├── cli.py
        ├── greet.py
        ├── __init__.py
        └── __main__.py
```

The actual code responsible for the tool\'s functionality will be stored in the file
`greet.py`{.interpreted-text role="file"}, named after the main module:

```python
import typer
from typing_extensions import Annotated


def greet(
    name: Annotated[str, typer.Argument(help="The (last, if --title is given) name of the person to greet")] = "",
    title: Annotated[str, typer.Option(help="The preferred title of the person to greet")] = "",
    doctor: Annotated[bool, typer.Option(help="Whether the person is a doctor (MD or PhD)")] = False,
    count: Annotated[int, typer.Option(help="Number of times to greet the person")] = 1
):
    greeting = "Greetings, "
    if doctor and not title:
        title = "Dr."
    if not name:
        if title:
            name = title.lower().rstrip(".")
        else:
            name = "friend"
    if title:
        greeting += f"{title} "
    greeting += f"{name}!"
    for i in range(0, count):
        print(greeting)
```

The above function receives several keyword arguments that determine how the greeting to
output is constructed.
Now, construct the command-line interface to provision it with the same, which is done
in `cli.py`{.interpreted-text role="file"}:

```python
import typer

from .greet import greet


app = typer.Typer()
app.command()(greet)


if __name__ == "__main__":
    app()
```

The command-line interface is built with [typer](https://typer.tiangolo.com/), an
easy-to-use CLI parser based on Python type hints.
It provides auto-completion and nicely styled command-line help out of the box.
Another option would be `argparse`{.interpreted-text role="py:mod"}, a command-line
parser which is included in Python\'s standard library.
It is sufficient for most needs, but requires a lot of code, usually in `cli.py`, to
function properly. Alternatively, [docopt](https://docopt.readthedocs.io/en/latest/)
makes it possible to create CLI interfaces based solely on docstrings; advanced users
are encouraged to make use of [click](https://click.palletsprojects.com/) (on which
`typer` is based).

Now, add an empty `__init__.py`{.interpreted-text role="file"} file, to define the
project as a regular `import package <Import Package>`{.interpreted-text role="term"}.

The file `__main__.py`{.interpreted-text role="file"} marks the main entry point for the
application when running it via `runpy`{.interpreted-text role="mod"} (i.e. `python -m
greetings`, which works immediately with flat layout, but requires installation of the
package with src layout), so initialize the command-line interface here:

```python
if __name__ == "__main__":
    from greetings.cli import app
    app()
```

In order to enable calling the command-line interface directly from the `source tree
<Project Source Tree>`{.interpreted-text role="term"}, i.e. as `python src/greetings`, a
certain hack could be placed in this file; read more at
`running-cli-from-source-src-layout`{.interpreted-text role="ref"}. ::::

### `pyproject.toml`

The project\'s `metadata <Pyproject Metadata>`{.interpreted-text role="term"} is placed
in `pyproject.toml`{.interpreted-text role="term"}. The `pyproject metadata keys
<Pyproject Metadata Key>`{.interpreted-text role="term"} and the `[build-system]` table
may be filled in as described in `writing-pyproject-toml`{.interpreted-text role="ref"},
adding a dependency on `typer` (this tutorial uses version *0.12.3*).

For the project to be recognised as a command-line tool, additionally a
`console_scripts` `entry point <entry-points>`{.interpreted-text role="ref"} (see
`console_scripts`{.interpreted-text role="ref"}) needs to be added as a `subkey
<Pyproject Metadata Subkey>`{.interpreted-text role="term"}:

```toml
[project.scripts]
greet = "greetings.cli:app"
```

Now, the project\'s source tree is ready to be transformed into a `distribution package
<Distribution Package>`{.interpreted-text role="term"}, which makes it installable.

## Installing the package with `pipx`

After installing `pipx` as described in
`installing-stand-alone-command-line-tools`{.interpreted-text role="ref"}, install your
project:

```sh
$ cd path/to/greetings/
$ pipx install .
```

This will expose the executable script we defined as an entry point and make the command
`greet` available. Let\'s test it:

```sh
$ greet
Greetings, friend!
$ greet --doctor Brennan
Greetings, Dr. Brennan!
$ greet --title Ms. Parks
Greetings, Ms. Parks!
$ greet --title Mr.
Greetings, Mr. mr!
```

Since this example uses `typer`, you could now also get an overview of the program\'s
usage by calling it with the `--help` option, or configure completions via the
`--install-completion` option.

To just run the program without installing it permanently, use `pipx run`, which will
create a temporary (but cached) virtual environment for it:

```sh
$ pipx run --spec . greet --doctor
```

This syntax is a bit impractical, however; as the name of the entry point we defined
above does not match the package name, we need to state explicitly which executable
script to run (even though there is only on in existence).

There is, however, a more practical solution to this problem, in the form of an entry
point specific to `pipx run`. The same can be defined as follows in
`pyproject.toml`{.interpreted-text role="file"}:

```toml
[project.entry-points."pipx.run"]
greetings = "greetings.cli:app"
```

Thanks to this entry point (which *must* match the package name), `pipx` will pick up
the executable script as the default one and run it, which makes this command possible:

```sh
$ pipx run . --doctor
```

## Conclusion

You know by now how to package a command-line application written in Python.
A further step could be to distribute your package, meaning uploading it to a `package
index <Package Index>`{.interpreted-text role="term"}, most commonly `PyPI <Python
Package Index (PyPI)>`{.interpreted-text role="term"}. To do that, follow the
instructions at `Packaging your project`{.interpreted-text role="ref"}. And once you\'re
done, don\'t forget to `do some research
<analyzing-pypi-package-downloads>`{.interpreted-text role="ref"} on how your package is
received!

---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
[[fleeting/other/Lang/Python/Language Intricacies/Some Advanced Typing Concepts in Python]]:

- ParameterSpec

- Overload

## Literals

Almost the same as an enum but worse and not really sure its benefits…. Simply dont use
them and use a StrEnum instead.
[Typing puzzle](https://github.com/anthonywritescode/typing-puzzles/tree/main/puzzles/003)
\- how to type sequence of strings that belong to a Literal array.
Not easy….

- You can use an Enum to narrow them to a type similar to the Literal though you need to
  duplicate the literal as an StrEnum

- Or do some runtime typing that is not worth doing

## TypedDict

Useful for JSON payload typing or other serialized data that can be reconstructed as a
dictionary. **THIS IS NOT A REPLACEMENT FOR A DATACLASS OR CLASSES IN GENERAL** The
usefulness of this is TBD

One use case might be kwargs!

Problem:
```python
from __future__ import annotations


def some_function(
        x: int,
        *,
        y: str = 'default',
        z: float | None = None,
) -> None:
    ...


def other_function(x: int, *, do_y: bool) -> None:
    kwargs = {'x': x}
    if do_y:
        kwargs['y'] = 'indeed!' # This gives an error as type checker cant guarantte that y value is string
    some_function(**kwargs, z=None)
```

But… if we add a typed dict:

```python
class _SomeFunctionKwargs(TypedDict):
    x: int
    y: NotRequired[str]


def some_function(
        x: int,
        *,
        y: str = 'default',
        z: float | None = None,
) -> None:
    ...


def other_function(x: int, *, do_y: bool) -> None:
    kwargs: _SomeFunctionKwargs = {'x': x}
    if do_y:
        kwargs['y'] = 'indeed!' # No error anymore
    some_function(**kwargs, z=None)
```

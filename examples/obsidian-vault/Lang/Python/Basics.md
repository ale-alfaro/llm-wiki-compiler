---
id: Python Resources
aliases: []
tags:
  - top
  - python
  - nexus
  - starting_point
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Args

` pos_only / = pos_only or kw_only, * = kw_only`

## How to use kwargs (typed)

```Python
from typing import NotRequired
from typing import TypedDict


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
        kwargs['y'] = 'indeed!'
    some_function(**kwargs, z=None)
```
# Fstrings

[[fleeting/other/Lang/Python/F-strings]]
# Online Reading Material

[Python tools handbook](https://pydevtools.com/handbook/)

# My own and others mistakes

[[Python Noob Habits]]

# Top YouTube Channels

- mCoding - Best concept explanation and thoroughness

  - https://github.com/mCodingLLC/VideosSampleCode

- ArjanCodes - Good, comprehensive examples + design patterns and best practices


- anthonywritescode - OG, niche

# Notes on topics

[[Python Async Generators]]

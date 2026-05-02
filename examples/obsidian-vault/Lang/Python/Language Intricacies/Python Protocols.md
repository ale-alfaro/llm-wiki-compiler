---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#python #generic_programming #metaprograming
https://www.turingtaco.com/protocols-default-methods-inheritance-and-more/

## Protocols as interface

```python
from typing import Protocol

class Animal(Protocol):
    def walk(self) -> None:
        ...

    def speak(self) -> None:
        ...
```

## Protocols for runtime validation

```Python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Animal(Protocol):
    def walk(self) -> None:
        ...

    def speak(self) -> None:
        ...

>>> dog = Dog()
>>> isinstance(dog, Animal)
True
```
## Protocols as generic bounds

```Python
from typing import TypeVar, Protocol


class SupportsLessThan(Protocol):
    def __lt__(self, __other: Any) -> bool:
        ...

S = TypeVar("S", bound=SupportsLessThan)

def my_max(x: S, y: S) -> S:
    if x < y:
        return y
    return x
Lets break this down. First, we implement
```

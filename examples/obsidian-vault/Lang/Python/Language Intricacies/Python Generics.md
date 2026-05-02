---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#python #generic_programming #metaprograming

[Generics Primer](https://arjancodes.com/blog/python-generics-tutorial/)

New syntax (3.12>=)

## Basics

```python
class Stack[T]:
    def __init__(self):
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()


def get_max[T](a: T, b: T) -> T:
    return a if a > b else b

print(get_max(10, 20))  # Output: 20
print(get_max("apple", "banana"))  # Output: banana
```

## Bounded type variables:

You can restrict a type variable to a certain subset of types.
```python

def concatenate[T:str](a: T, b: T) -> T:
    return a + b

print(concatenate("hello", "world"))  # Output: helloworld
```

## Constrained type variables:

Much like bound variables, you can also constrain a number of types.

```python
def mult[T:(int, float)](a: T, b: T) -> T:
    return a * b

print(mult(10, 24.5)) # Output: 245.0
```
## Generic inheritance:

You can create classes that inherit from generic classes.

```python
class Container[T]:
    def __init__(self, value: T):
        self.value = value

class IntContainer(Container[int]):
    pass
```

int_container = IntContainer(42) print(int_container.value) # Output: 42 Final

Old Syntax (< 3.12 )

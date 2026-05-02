---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
MUST WATCH -[ Python Super/MRO](https://youtu.be/X1PQ7zzltz4?si=q-mKvEMfUSjWzlMQ)

Python’s super does NOT mean “parent”.

It means “next in line”.
What line?
The Method Resolution Order (MRO) of an object, which defines the search order
for attribute lookups.
super() uses some very sneaky techniques, such as examining the current stack frame, and
object proxying. All this is explained in great detail, for both single and multiple
inheritance, and a pure Python implementation of super is given.

### AI Summary

• Basic Usage: `super()` is used in derived classes to call methods from a parent or
“next in line” class, often to extend functionality without copying code.
It automatically handles the `self` or `class` argument.
• Misconceptions & MRO: `super()` doesn’t always call the immediate parent.
Instead, it follows the Method Resolution Order (MRO) of the object, which is the search
path for attributes.
`super()` essentially means “next in line” in the MRO. • Cooperative Inheritance: For
`super()` to work reliably in complex hierarchies, classes must cooperate by inheriting
from a common root and consistently calling `super()` in overridden methods (except
possibly the root).
• Example: If you have `A` inheriting from `Root`, and `B` inheriting
from `Root`, and `C` inheriting from `A` and `B`, then for `super()` to chain correctly
through `C`, `A`, and `B` to reach `Root`, `A` and `B` must also call `super()` in their
overridden methods. • Handling Arguments: For methods like `_init_` that might have
different arguments across the hierarchy, the video suggests using `args` and `kwargs`
and “peeling” off the arguments needed by each class, passing the rest via `super()`. •
Example: If `ClassA._init_` takes `color` and `ClassB._init_` takes `size`, a
`ClassC._init_` that inherits from both might look like this: `python class
ClassC(ClassA, ClassB): def _init_(self, c_param, *args, *kwargs): self.cparam = cparam
super()._init_(*args, *kwargs) ` `ClassC` takes its `c_param` and passes all other
`args` and `kwargs` up the chain for `ClassA` and `ClassB` to use.
• How `super()` Works Internally: `super()` is actually a class that returns a proxy
object. The zero-argument form of `super()` works by inspecting the caller’s stack frame
to find the `self` (or first positional) argument and a special `_class_` variable
(added by Python when `super()` is mentioned) to determine the current class.
The two-argument form explicitly takes the class and object.
• Example: When you write `super().mymethod()`, Python secretly looks at your function’s
local variables to find `self` and also injects a `_class__` variable that tells
`super()` which class’s method it’s currently executing from.
This allows `super()` to know its starting point in the MRO without you explicitly
telling it.

## Examples

Source -
[mCoding](https://github.com/mCodingLLC/VideosSampleCode/tree/master/videos/093_super_in_python)

```python
import pytest

"""
Note: all these classes that derive from set only properly implement super calls in add and init.
If you wanted to use these for real, you would need super calls in all the methods
that add elements, e.g. update.
"""


class ValidatedSet(set):
    def __init__(self, *args, validators=None, **kwargs):
        self.validators = list(validators) if validators is not None else []
        if args:
            (elements,) = args
            self.validate_many(elements)
        super().__init__(*args, **kwargs)

    def validate_one(self, element):
        for f in self.validators:
            if not f(element):
                raise ValueError(f"invalid element: {element}")

    def validate_many(self, elements):
        if not self.validators:
            return
        for elem in elements:
            self.validate_one(elem)

    def add(self, element):
        self.validate_one(element)
        super().add(element)


def is_int(x):
    return isinstance(x, int)


def validated_set_example():
    print("VALIDATED SET EXAMPLE")
    ints = ValidatedSet([1, 2, 3], validators=[is_int])
    ints.add("5")
    print(ints)
    print()


class ReducedSet(set):
    def __init__(self, *args, reducer=None, **kwargs):
        self.reducer = reducer
        if args:
            (elements,) = args
            if reducer is not None:
                args = (map(reducer, elements),)

        super().__init__(*args, **kwargs)

    def add(self, element):
        if self.reducer is not None:
            element = self.reducer(element)
        super().add(element)


def reduced_set_example():
    print("REDUCED SET EXAMPLE")
    lens = ReducedSet(reducer=len)
    lens.add("hello")
    assert 5 in lens
    print()


class ModularSet(ValidatedSet, ReducedSet):
    def __init__(self, *args, n, **kwargs):
        def reduce_mod_n(x):
            return x % n

        super().__init__(*args, validators=[is_int], reducer=reduce_mod_n, **kwargs)


def modular_set_example():
    print("MODULAR SET EXAMPLE")

    mod5 = ModularSet([0, 1, 2, 5, 10], n=5)
    print(ModularSet.__mro__)
    print(mod5)

    print()


def main():
    # validated_set_example()
    # reduced_set_example()
    modular_set_example()


if __name__ == '__main__':
    main()
```

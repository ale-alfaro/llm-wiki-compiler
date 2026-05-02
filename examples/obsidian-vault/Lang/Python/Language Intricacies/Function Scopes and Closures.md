---
tags:
  - advanced
  - python
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Overview

• Compile-Time vs. Runtime: Python compiles code to bytecode at compile time and then
interprets that bytecode at runtime The crucial rule is that while variable lookups
happen at runtime, where Python will look for a variable is determined at compile time.
• Local Variables: If a variable is assigned within a function, the compiler treats it
as a local variable for that entire function, even if the assignment is conditional or
happens later in the code.
This can lead to `UnboundLocalError` if the assignment isn’t reached . • Enclosing Scope
& Closures: For variables not found locally or globally, Python looks in enclosing
function scopes. If an inner function needs to access a variable from an outer
(non-global) scope, Python uses a “cell” within the function’s closure to store a
reference to that variable.
This ensures the inner function always gets the latest value of the variable, even if
the outer function has completed its execution.
• Global Variables: Global variables are looked up in the module’s global namespace, not
through cells in a closure.
• `def` keyword: The `def` keyword creates a new function object at runtime, hooking it
up to pre-existing bytecode.
Each call to an outer function can create a new, distinct inner function object with its
own closure. • `nonlocal` and `global`: These keywords instruct the compiler to treat a
variable as belonging to an enclosing function’s scope (`nonlocal`) or the global scope
(`global`) for assignment purposes, overriding the default compile-time determination

# Examples

[mCoding Examples](https://github.com/mCodingLLC/VideosSampleCode/blob/master/videos/111_python_closures/closures.py)

## Scope Puzzle

[mCoding Video with Answers](https://youtu.be/jXugs4B3lwU?si=W0lgtJy09XS0E3Gv)

```Python
x = "global x"


def level_one():
    return x


def level_two(v):
    print(v)
    if v:
        x = "local x"
    return x


def level_three():
    z = "outer z"

    def inner(y):
        return x, y, z

    return inner("y arg")


def level_four():
    z = "first outer z"

    def inner(y):
        return x, y, z

    z = "second outer z"
    return inner("y arg")


def level_five(n):
    z = f"outer z {n}"

    def inner(y):
        return x, y, z

    return inner


def call_n_times(n):
    def inner(f):
        for _ in range(n):
            f()

    return inner


call_3_times = call_n_times(3)
call_3_times(lambda: print("hello"))


def level_six():
    z = "outer z"

    def donky():
        def inner(y):
            return x, y, z

        z = "donky z"
        return inner

    def chonky():
        x = "chonky x"
        f = donky()
        return f("y arg")

    return chonky()


def what_about_nonlocal_and_global():
    x = "nonlocal x"

    def f():
        nonlocal x
        return x

    def g():
        global x
        return x

    return f, g
```

```python

def what_about_lambdas_and_comprehensions():
    l = [x * x for x in range(10)]
    l = list(x * x for x in range(10))
    l = list((x * x for x in range(10)))

    g = (x * x for x in range(10))

    def gen():
        for x in range(10):
            yield x * x

    g = gen()


def level_seven():
    def please_dont_do_this():
        if False:
            a = None

        def gen_func():
            nonlocal a
            for v in range(10):
                a = v
                yield v

        return gen_func(), lambda: a

    gen, fun = please_dont_do_this()

    # print(fun()) # error
    next(gen)
    print(fun())  # 0
    next(gen)
    print(fun())  # 1


_empty = object()


class Cell:
    def __init__(self, cell_contents=_empty):
        self._cell_contents = cell_contents

    def __repr__(self):
        contents = self._cell_contents
        if contents is _empty:
            contents_str = "empty"
        else:
            contents_str = f"{contents.__class__.__name__} object at {id(contents):016X}"
        return f"<{self.__class__.__name__} at {id(self):016X}: {contents_str}>"

    @property
    def cell_contents(self):
        if self._cell_contents is _empty:
            raise ValueError("Cell is empty")
        return self._cell_contents

    @cell_contents.setter
    def cell_contents(self, value):
        # except you can't do this from Python
        self._cell_contents = value


def main():
    level_seven()


if __name__ == '__main__':
    main()
```

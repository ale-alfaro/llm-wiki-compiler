---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
[Generators Basics](https://youtube.com/watch?v=tmeKsb2Fras&si=Bd-rdIqffTOoAPT5)

```python
def example_composable():
	with open("nums.txt") as file:
		nums = (row.partition("#")[0].rstrip() for row in file)
		nums = (row for row in nums if row)
		nums = (float(row) for row in nums)
		nums = (x for x in nums if math. isfinite (x))
		nums = (max(0., X) for x in nums)
		s = sum(nums)
		# print(f"the sum is {s}")
```

# Watch Out for Clean up!

![[Python Async Generators ( Do not use lightly)|Python Async Generators ( Do not use lightly)]]


In short , use `aclosing` or implement the generator as a `contextmanager` class and/or use the `@contextmanager` decorator. if possible use anyio.`AsyncContextManagerMixin`

```python 

class Resource:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"cleanup: {self.name}")


async def gen():
    with Resource("database/lock/file/etc"):
        for x in range(3):
            print(f"yield {x}")
            try:
                yield x
            except BaseException as exc:# use finally clause as well
                print("got exc: ", type(exc).__name__)
                raise


async def main():
    with Resource("outer resource"):
        async with contextlib.aclosing(gen()) as g:
            async for x in g:
                print(f"got {x}")
                if x == 1:    # Not encouraged to use break in generators
                    break
        print("after loop")
```

[Async Generator cleanup](https://youtu.be/N56Jrqc7SBk?si=k49h7IYpfvxL0Tjj)

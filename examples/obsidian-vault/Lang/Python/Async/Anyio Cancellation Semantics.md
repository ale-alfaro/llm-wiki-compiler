---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
Cancellation is handled by anyio task group context manager.
The expected result of the function below is that the ValueError will cancel both tasks
and surface the error all the way to main.
Again both tasks are cancelled as they are in the same task group
```python
import anyio
import time

async def failing_task():
    print("Starting failing task")
    await anyio.sleep(1)
    raise ValueError("Simulated error")

async def long_task():
    try:
        print("Starting long task")
        for i in range(5):
            print(f"Long task: iteration {i}")
            await anyio.sleep(1)
        print("Long task completed")
    except anyio.get_cancelled_exc_class():
        print("Long task was cancelled")
        raise

async def main():
    try:
        async with anyio.create_task_group() as tg:
            tg.start_soon(failing_task)
            tg.start_soon(long_task)

        print("This line won't be reached")
    except ValueError as e:
        print(f"Caught error: {e}")

    print("Main function continuing after error")

if __name__ == "__main__":
    anyio.run(main)
```

There’s two context managers in AnyIO, `move_on_after` (cancels without an exception)
and `fail_after` (throws ValueError)

```python
import anyio


async def main():
   async with anyio.create_task_group():
       with anyio.move_on_after(1) as scope:
           print('Starting sleep')
           await anyio.sleep(2)
           print('This should never be printed')

       # The cancel_called property will be True if timeout was reached
       print('Exited cancel scope, cancelled =', scope.cancel_called)


anyio.run(main)
```

### Bonus example

From [article](https://betterstack.com/community/guides/scaling-python/anyio-python/)
```python
import functools
from anyio import move_on_after
from typing import Optional, TypeVar, Callable, Any

T = TypeVar('T')

def with_timeout(timeout: float):
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            with move_on_after(timeout) as cancel_scope:
                return await func(*args, **kwargs)

            if cancel_scope.cancelled_caught:
                raise TimeoutError(f"Function {func.__name__} timed out after {timeout} seconds")

        return wrapper
    return decorator


@with_timeout(2.0)
async def slow_operation():
    print("Slow operation started")
    await anyio.sleep(3)  # This takes longer than the timeout
    print("Slow operation completed")  # This won't print because of the timeout
    return "Result"

@with_timeout(2.0)
async def fast_operation():
    print("Fast operation started")
    await anyio.sleep(1)  # This finishes within the timeout
    print("Fast operation completed")
    return "Success"

async def main():
    try:
        result = await fast_operation()
        print(f"Fast operation result: {result}")
    except TimeoutError as e:
        print(f"Error in fast operation: {e}")

    try:
        result = await slow_operation()
        print(f"Slow operation result: {result}")
    except TimeoutError as e:
        print(f"Error in slow operation: {e}")

    print("Main function completed")

if __name__ == "__main__":
    anyio.run(main)
```

![Sequence Diagram of above code execution
flow](https://imagedelivery.betterstackcdn.com/xZXo0QFi-1_4Zimer-T0XQ/b400df86-666e-44c3-b5ef-022794762b00/orig)

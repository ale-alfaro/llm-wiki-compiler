---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#references #python #async #anyio #top #basics

# TLDR

- Don’t use async generators within a context managers unless you can guarantee that the
  generator will be able to exit before the parent context manager

- This includes cancel scopes, i.e task groups or nurseries

# Good examples of how to use them

## Producer and consumer pattern

Real world example. Always use two tasks instead of one to be able to use an asyng
generator and for loop safely

```python
import anyio


async def producer(sender):
    async with sender:
        for i in range(3):
            await sender.send(f'message {i}')


async def consumer(receiver):
    async with receiver:
        async for message in receiver:
            print(f'received: {message}')


async def main():
    sender, receiver = anyio.create_memory_object_stream()
    async with anyio.create_task_group() as tg:
        tg.start_soon(producer, sender)
        tg.start_soon(consumer, receiver)


anyio.run(main)
```

## List comprehension generator

Less practical but still good to know that it can be done this way too

```python
async def test_iterate() -> None:
    async def receiver() -> None:
        received_objects.extend([item async for item in receive])

    send, receive = create_memory_object_stream[str]()
    received_objects: list[str] = []
    async with create_task_group() as tg:
        tg.start_soon(receiver)
        await send.send("hello")
        await send.send("anyio")
        await send.aclose()

    assert received_objects == ["hello", "anyio"]

    send.close()
    receive.close()
```

## Limited Scoped Async Generator

if we know that the generator will finish before cancel scope or parent context manager
ends one can do this too:

```python
async def process_items(receive_stream: MemoryObjectReceiveStream[str]) -> None:
    async with receive_stream:
        async for item in receive_stream:
            print('received', item)


async def main():
    send_stream, receive_stream = create_memory_object_stream[str]()
    async with create_task_group() as tg:
        tg.start_soon(process_items, receive_stream)
        async with send_stream:
            for num in range(10):
                await send_stream.send(f'number {num}')
```

# Explanations

From the Trio
[docs](https://trio.readthedocs.io/en/stable/reference-core.html#trio.as_safe_channel):

> If you iterate over an async generator in its entirety, like the example above does,
> then the execution of the async generator will occur completely in the context of the
> code that’s iterating over it, and there aren’t too many surprises.
> 
> If you abandon a partially-completed async generator, though, such as by `break`ing
> out of the iteration, things aren’t so simple.
> The async generator iterator object is still alive, waiting for you to resume
> iterating it so it can produce more values.
> At some point, Python will realize that you’ve dropped all references to the iterator,
> and will call on Trio to throw in a
> [`GeneratorExit`](https://docs.python.org/3/library/exceptions.html#GeneratorExit "(in
> Python v3.14)") exception so that any remaining cleanup code inside the generator has
> a chance to run: `finally` blocks, `__aexit__` handlers, and so on.
> 
> So far, so good. Unfortunately, Python provides no guarantees about *when* this
> happens. It could be as soon as you break out of the `async for` loop, or an arbitrary
> amount of time later.
> It could even be after the entire Trio run has finished!
> Just about the only guarantee is that it *won’t* happen in the task that was using the
> generator. That task will continue on with whatever else it’s doing, and the async
> generator cleanup will happen “sometime later, somewhere else”: potentially with
> different context variables, not subject to timeouts, and/or after any nurseries
> you’re using have been closed.
> If you don’t like that ambiguity, and you want to ensure that a generator’s `finally`
> blocks and `__aexit__` handlers execute as soon as you’re done using it, then you’ll
> need to wrap your use of the generator in something like
> [async_generator.aclosing()](https://async-generator.readthedocs.io/en/latest/reference.html#context-managers):

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

[Async Generator cleanup](https://youtu.be/N56Jrqc7SBk?si=k49h7IYpfvxL0Tjj)

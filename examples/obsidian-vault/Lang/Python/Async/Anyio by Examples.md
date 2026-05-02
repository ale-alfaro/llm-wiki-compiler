---
id: Anyio by Examples
aliases: []
tags:
  - asynchronous
  - python
  - anyio
  - advanced
created: 2025-10-30T21:05:26-07:00
title: Anyio by Examples
url: https://lewoudar.medium.com/anyio-all-you-need-for-async-programming-stuff-4cd084d0f6bd
note_type: other
categories: []
modified: 2026-04-19
---
# Async Generators

[[Python Async Generators ( Do not use lightly)]]

# Streams/Channels

[Anyio Docs](https://anyio.readthedocs.io/en/stable/streams.html)

Top feature of anyio in my opinion.
Very intuitive and flexible.
There’s two major stream classess

**ByteStreams**

> Byte streams (“Streams” in Trio lingo) are objects that receive and/or send chunks of
> bytes. They are modelled after the limitations of the stream sockets, meaning the
> boundaries are not respected.
> In practice this means that if, for example, you call `.send(b'hello ')` and then
> `.send(b'world')`, the other end will receive the data chunked in any arbitrary way,
> like (`b'hello'` and `b' world'`), `b'hello world'` or (`b'hel'`, `b'lo wo'`,
> `b'rld'`).

**ObjectStreams**

> Object streams (“Channels” in Trio lingo), on the other hand, deal with Python
> objects. The most commonly used implementation of these is the memory object stream.
> The exact semantics of object streams vary a lot by implementation.

Aside from those several wrappers exist for each.
From most useful to least

- **BufferedStreams** - Has nice receive APIs like `receive_until` and just a better
  Stream for bytes

- **TextStream** - Converts bytes to text or vice-versa automatically

- **StapledStreams** - Joins two streams (rx and tx) into one

## Multi-consumer and producer channels

```python
import anyio


async def producer(name, sender):
    async with sender:
        for i in range(3):
            await sender.send(f'{i} from producer {name}')
            await anyio.sleep(random.random())


async def consumer(name, receiver):
    async with receiver:
        async for value in receiver:
            print(f'consumer {name} got value {value}')
            await anyio.sleep(random.random())


async def main():
    sender, receiver = anyio.create_memory_object_stream()
    async with anyio.create_task_group() as tg:
        async with sender, receiver:
            # producers
            tg.start_soon(producer, 'A', sender.clone())
            tg.start_soon(producer, 'B', sender.clone())
            # consumers
            tg.start_soon(consumer, 'A', receiver.clone())
            tg.start_soon(consumer, 'B', receiver.clone())
```

# Use Connectables like this!

```python

    class MyNetworkClient:
        def __init__(
            self,
            connectable: ByteStreamConnectable | tuple[str, int] | str | PathLike[str],
            tls: bool | SSLContext = False
        ):
            self.connectable = as_connectable(connectable, tls)

        async def __aenter__(self):
            # Connect to the remote and enter the stream's context manager
            self._stream = await self.connectable.connect()
            await self._stream.__aenter__()
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            # Exit the stream's context manager, thus disconnecting it
            await self._stream.__aexit__(exc_type, exc_val, exc_tb)
```

# Exception Groups:

```python
async def task(number):
  print('Task', number, 'is running')
  await anyio.sleep(1)
|if number == 2:
   raise ValueError
|if number == 4:
   raise TypeError
|print('Task', number, 'finished')

async def main():  
    start = anyio.current_time()  
    try:  
        async with anyio.create_task_group() as tg:  
            for i in range(5):  
                tg.start_soon(task, i)  
    except* ValueError as exc_group:  
        for exc in exc_group.exceptions:  
            # handle ValueError here  
            print(exc)  
    except* TypeError as exc_group:  
        for exc in exc_group.exceptions:  
            # handle TypeError here  
            print(exc)  

    runtime = anyio.current_time() - start  
    print(f'program executed in {runtime:.2f}s')
```

# Clean-up during cancellation

```python
async def main():  
    start = anyio.current_time()  
    try:  
        async with anyio.create_task_group() as tg:  
            for i in range(5):  
                tg.start_soon(task, i)  
    except* ValueError as exc_group:  
        for exc in exc_group.exceptions:  
            # handle ValueError here  
            print(exc)  
    except* TypeError as exc_group:  
        for exc in exc_group.exceptions:  
            # handle TypeError here  
            print(exc)  

    runtime = anyio.current_time() - start  
    print(f'program executed in {runtime:.2f}s')
```

### Producer Consumer Pattern

```python
async def main():  
    start = anyio.current_time()  
    try:  
        async with anyio.create_task_group() as tg:  
            for i in range(5):  
                tg.start_soon(task, i)  
    except* ValueError as exc_group:  
        for exc in exc_group.exceptions:  
            # handle ValueError here  
            print(exc)  
    except* TypeError as exc_group:  
        for exc in exc_group.exceptions:  
            # handle TypeError here  
            print(exc)  

    runtime = anyio.current_time() - start  
    print(f'program executed in {runtime:.2f}s')
```

- Line 17, we create a memory channel.
  The default size of the channel is 0 which is a good default to prevent bugs related
  to back pressure. If you want an infinite size, just pass the value *math.inf* but this
  is rarely a good idea.
  For more literature about this, I can only recommend you read this
  [section](https://trio.readthedocs.io/en/stable/reference-core.html#buffering-in-channels)
  of trio’s documentation.

- In producer and consumer functions, you will notice that we start with the syntax
  “*async with..*”. This is the correct way to do to ensure correct resource cleanup.

- If you prefer the traditional approach with a queue, you can combine the sender and
  receiver of the previous example into a unique object using the
  [StapledStream](https://anyio.readthedocs.io/en/stable/streams.html#stapled-streams)
  class. If you do that, create the memory channel with a minimum value of 1 if not, you
  will have surprises.
### Multiple producer/consumers:

```python


async def producer(name, sender):
    async with sender:
        for i in range(3):
            await sender.send(f'{i} from producer {name}')
            await anyio.sleep(random.random())


async def consumer(name, receiver):
    async with receiver:
        async for value in receiver:
            print(f'consumer {name} got value {value}')
            await anyio.sleep(random.random())


async def main():
    sender, receiver = anyio.create_memory_object_stream()
    async with anyio.create_task_group() as tg:
        async with sender, receiver:
            # producers
            tg.start_soon(producer, 'A', sender.clone())
            tg.start_soon(producer, 'B', sender.clone())
            # consumers
            tg.start_soon(consumer, 'A', receiver.clone())
            tg.start_soon(consumer, 'B', receiver.clone())


anyio.run(main)
```

- Even if we clone the channels, a value is sent only to a unique consumer.

- The original channel objects created at line 21 will not be closed until all clones
  are closed.

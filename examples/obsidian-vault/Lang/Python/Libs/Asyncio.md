---
id: Asyncio
aliases: []
tags:
  - python
  - async
  - lib
  - top
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
FYI: A lot of this information was sourced from this
[video](https://youtu.be/E7Yn5biBZ58?si=uGJj_uvME-xj3hKF) of an 8-part playlist that is
the most comprehensive video tutorials on Asyncio.
It is great stuff

# Overview

- Single-threaded, callback based event loop

- There’s several event loops implementation but the one most recommended is
  uv_event_loop

- There can be multiple event loops (one per thread?)

- The event loop must be started manually through `asyncio.run` or one of the lower
  level methods `asyncio.get_event_loop`

- The event loop is good at handling concurrent operations that aren’t CPU intensive, IO
  operations are good use case but running an algorithm heavy computation in the
  background is not

  - Python has a multiprocessing library to handle those CPU intensive tasks.

  - Multi-threading is also available though it isn’t recommended to be used over
    asyncio and should only be used for backwards compatibility or legacy code
    integration

- The concurrency model is **cooperative** concurrency, as oppose to **preemptive** .
  What this means is that each task will be treated ‘fairly’ and given the same priority
  as the others

  - This means that in practice the event loop can get bogged down by a single task, and
    prevent the others from running

Other approaches to concurrency exist that are mostly dead except for
[[1763442396-HHTS|Trio]].

# How does it work?

## Low-level implementation

Selector [[1763442554-ZRQD|syscall]] based (`select(1)`). Allows reading multiple file
descriptors that can be read concurrently by taking as an input multiple file
descriptors and returning the ones that are available for reading or other IO
operations. This approach is called **Reactor** based concurrency, the SelectorEventLoop
reacts to the file descriptors being ready for action and then executes the desired
action. The other approach is the **IO Completion Ports (Proactor-based)** which instead
dispatches a thread to do a task when requested instead of reacting to it once it’s
ready. Only supported in Windows and is more performant by default as oppose to the
Selector/Reactor-based approach.

![[Event Loop Reactor-Proactor.png]]

AbstractEventLoop - Interface for event loop, abstracts the backend implementation of
the EventLoop implementation

### Unix-based EventLoop Selectors

Depending on the specific platform `asyncio` will select the most peformant event loop
which are:

- Linux - epoll

- MacOS/BSD - Kqueue

![[Unix-based EventLoop Selectors.png]]

### Specifying the EventLoopSelector

Example of specifying the OG `select` selector:

```python
import asyncio
import selectors

async def main():
   ...

loop_factory = lambda: asyncio.SelectorEventLoop(selectors.SelectSelector())
asyncio.run(main(), loop_factory=loop_factory)
```

The only reason why the event-loop selector should be specified is when creating an
event loop in a **thread other than the main thread**. Python won’t handle the creation
of a new of event-loop so one must do it manually.

## Specifying the EventLoop

The other choice over the default event-loop is the `uv_loop` event loop.
This requires an `import uv_loop` and installing the package `uv_loop`. It is said that
it’s more performant event-loop and it is recommended once ready for production

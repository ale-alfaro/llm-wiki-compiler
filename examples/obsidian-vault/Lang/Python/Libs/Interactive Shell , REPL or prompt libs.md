---
id: Interactive Shell , REPL or prompt libs
aliases: []
tags:
  - python
  - prompt
  - shell
  - cli
  - app
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# prompt_toolkit

## Asyncio

### Joining an existing event loop (Most common use case)

Supports asyncio natively which is not common so this is a big plus.
Still not sure 100% what is the right way to use it with anyio but this seems to be a
necessary step for me to use all its features:

```python
async def main():
    # Define application.
    application = Application(
        ...
    )

    result = await application.run_async()
    print(result)
# Example of running an event loop
asyncio.get_event_loop().run_until_complete(main())
# Or running it in anyio
anyio.run(main,backend="asyncio")
```

### Input hooks

- [InputHook](https://github.com/prompt-toolkit/python-prompt-toolkit/blob/main/docs/pages/advanced_topics/input_hooks.rst)
  Input hooks are a tool for inserting an external event loop into the prompt*toolkit
  event loop, so that the other loop can run as long as prompt_toolkit (actually
  asyncio) is idle. This is used in applications like `IPython <https://ipython.org/>`*,
  so that GUI toolkits can display their windows while we wait at the prompt for user
  input.

As a consequence, we will “trampoline” back and forth between two event loops.

This will use a :class:`~asyncio.SelectorEventLoop`, not the :class:
:class:`~asyncio.ProactorEventLoop` (on Windows) due to the way the implementation works
(contributions are welcome to make that work).

```python

    from prompt_toolkit.eventloop.inputhook import set_eventloop_with_inputhook

    def inputhook(inputhook_context):
        # At this point, we run the other loop. This loop is supposed to run
        # until either `inputhook_context.fileno` becomes ready for reading or
        # `inputhook_context.input_is_ready()` returns True.

        # A good way is to register this file descriptor in this other event
        # loop with a callback that stops this loop when this FD becomes ready.
        # There is no need to actually read anything from the FD.

        while True:
            ...

    set_eventloop_with_inputhook(inputhook)

    # Any asyncio code at this point will now use this new loop, with input
    # hook installed.
```

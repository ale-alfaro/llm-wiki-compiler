---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#python #asynchronous #tools #advanced

Useful tools for [[Python Async Generators]]
## Runtime tools

![[screenshot 1.png]]
## Trio Instrument

class SlowTaskDetector(Instrument): def **init**(self, limit=0.1): self.lim = limit
self.deadline = 1e999 Trio instruments a flexible framework for runtime observability
def after_task_step(self, task): now = time.perf.
_counter () if now › self.deadline: raise TooSlowError self.deadline = now + self.lim

```python
@not_in_async
# sync → ok 
# async → crash! 
# in thread → ok
@not_in_async 
def expensive_fn():
	"""Does something slow..."""


expensive_fn() # 0K
async def afn():
		expensive_fn() # crash! 
		operator.call(expensive_fn # crash!
		)
			await trio.to_thread.run_sync(expensive_fn # 0K again
```

```Python
async def proxy_one_way(source):
	while data := await source.receive_some (1024):
		await sink.send_all(data)
	await sink.send_eof()
async def proxy_two_way(a, b):
	async with trio.open_nursery() as nursery:
	nursery.start_soon(proxy_one_way, a, b) 
			nursery.start_soon(proxy_one_way, b, a)
async def main(how_long=10):
with trio.move_on_after(how_long):
a = await trio.open_tcp_stream("localhost"
12345)
b = await trio.open_tcp_stream("localhost", 54321)
async with a, b:
await proxy_two_waya, b)
print("all done!")
```
## Static Analysis

### LibCST (AST Parser and Formatter library )

```python
import libest as cst, libcst.codemod, libcst.matchers as m
class CodeMod(cst.codemod.VisitorBasedCodemodCommand):
@m.call_if_inside(m.FunctionDef(asynchronous=m.Asynchronous()))
@m.leave(m.Call(m.Attribute(m.Name("time"), m.Name("sleep"))))
def asyncify_sleep(self, -, new_node) :
trio_sleep = cst.Attribute(cst.Name("trio"), cst.Name("sleep"))
return cst.Await(new_node.with_changes(func=trio_sleep))
```
![[screenshot 2.png]]

### Flake 8 Plugin

https://youtu.be/vqlHqqhTwzA?si=0yRaLrpHiEfG22hA
```python
(selected!) List of warnings

• TRI0100: A with trio.fail_after(...): without any await statements is pointless.

• TRI0101: yield in a nursery or cancel scope is only safe when implementing a context manager.

• TRI0102: It's unsafe to await inside finally: or except BaseException/trio.Cancelled unless you use a shielded cancel scope with a timeout.

• TRI0103,104: except BaseException, except Cancelled or a bare except: might not re-raise.
If you don't want to re-raise BaseException, add a separate handler for Cancelled before.

• TRI0105: Calling a trio async function without immediately awaiting it.

• TRI0109: Async function definition with a timeout parameter - use trio. [fail/move_on]_[after/at] instead

• TRI0110: while <condition>: await trio.sleep() should be replaced by a trio.Event.

• TRI0111: Variable, from context manager opened inside nursery, passed to start[_soon] might be invalidly accessed while in use, due to context manager closing before the nursery.

• TRI0112: Nursery body with only a call to nursery.start[_soon] and not passing itself as a parameter can be replaced with a regular function call.

• TRI0113: Using nursery.start_soon in __aenter__ doesn't wait for the task to begin. Consider replacing with nursery.start.

• TRI0115: Replace trio.sleep(0) with the more suggestive trio.lowlevel.checkpoint().

• TRI0116: trio.sleep() with ›24 hour interval should usually betrio.sleep_forever().

• TRI0117: Don't raise or catch trio.[NonBase]MultiError, prefer BaseExceptionGroup.

• TRIO118: Don't assign the value of anyio.get_cancelled_exc_class() to a variable, since that breaks linter checks and multi-backend programs.
```

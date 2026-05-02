---
id: Python Libs To Checkout
aliases: []
tags:
  - lib
  - python
  - tools
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Core

## Object-oriented or Dataclass focused

### Attrs

> [!QUOTE] The following libraries build on attrs to provide additional functionality or
> have special support for attrs classes: `attrs2bin`: Binary serializer for attrs-based
> classes. `attrs-strict`: runtime validation for attributes specified in attrs
> dataclasses based on the type field provided.
> `bfa`: Builders for attrs `cattrs`: for structuring and unstructuring data `cyclopts`:
> for modern, easy-to-use command-line interfaces `datargs`: A paper-thin wrapper around
> argparse that creates type-safe parsers from dataclass and attrs classes.
> `desert`: DRY deserialization for dataclasses and attrs classes.
> `inline-snapshot`: create and update inline snapshots in your Python code.
> `marshmallow-attrs`: Marshmallow serialization for attrs classes.
> `msgspec`: fast serialization and validation library, with builtin support for JSON,
> MessagePack, YAML, and TOML – and first-class support for attrs `prettyprinter`: an
> extensible alternative to pprint comes with attrs support.
> `related`: for creating nested object models that can be serialized to and
> de-serialized from nested python dictionaries `Rich` supports pretty-printing of attrs
> classes. `serde`: a performant serialization / deserialization extension to and from
> plain dicts. `spock`: lightweight typed and stateful parameter configuration library
> (mainly for ML) that wraps attrs `typecats`: Make attrs classes act more like
> structural (rather than nominal) typing; built on top of cattrs.
> `valid8`: provides an alternate way to add validation to attributes, supporting
> various coding styles to define your validation functions and validation exception
> types/messages `yasoo`: Serializes and deserializes attrs and dataclass objects
> without relying on type hints.

# Debugging

**Print debugging but better** [Icecream](https://github.com/gruns/icecream)

**Asyncio Debugging** [aiodebug](https://gitlab.com/quantlane/libs/aiodebug)

# Testing

**Asyncio Unit Testing**
[asynctest](https://asynctest.readthedocs.io/en/latest/index.html)

# Profiling

**Native Python Profiler** Not super useful by itself for async code profiling though …
[cProfile](https://docs.python.org/3/library/profile.html)

**Visualizer for tracing** Needs cProfile to collect the profiling data
[KCachegrind](https://kcachegrind.github.io/html/Home.html)

Add this to cProfile help visualize with KCachegrind
[pyprof2calltree](https://pypi.org/project/pyprof2calltree/)

**Targetted Profiler** [line_profiler](https://github.com/pyutils/line_profiler)

## Tools/ Utility

**Async Logging for debugging and profiling** I wasnt able to get it to work … but need
to try again [aiologger](https://async-worker.github.io/aiologger/)

[Jinja](https://github.com/noirbizarre/jinja2)

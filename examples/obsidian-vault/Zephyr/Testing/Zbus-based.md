---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Microservices in ZBus

# What is a Microservice?

Term comes fromes Web Development and int that context without going into the details it means:

**Modular Software**

- Fine-grained, loosely coupled, Independently deployable software components

**Fast Iteration and Flexibility through encapsulation**

- Organized around business functions. Many teams in a large organization can push updates faster and without fear of breaking everything.

## How Does it Relate to Firmware??

Same principles are useful for FW design as well. But the execution and the how to is very different.
In the context of FW a micro serivce is a **task**, a unit of work that can be encapsulated in its own context.
The benefits when talking about FW are:

**Modular Software**

- Independent, loosely coupled, fine-grained tasks communicating through well-defined IPC mechanisms

**Fast Iteration and Flexibility through encapsulation**

- Better code organization makes firmware easier to read, maintain, and test.

**Composability**
e Smaller pieces are more reusable

# How to build it in Zephyr

# Pub-Sub IPC Model

## ZBus

![[Zephyr bus (zbus)]]

## lterable Sections

- Leverage the Linker
  - Allow modules to register themselves.
  - No API call at bootup, no central registry.

- Build Time Configuration
  - Compiling a file integrates that module into the system.
  - Remember: no main(), no public APIs!

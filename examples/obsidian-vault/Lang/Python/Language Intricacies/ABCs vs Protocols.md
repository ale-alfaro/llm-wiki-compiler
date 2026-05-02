---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#python #generic_programming #metaprograming
## Abstract Base Classes

Belong to their subclasses.
An ABC is not usable by itself, it can only be used by implementing a child class and
requires strict class hierarchy.

- Good mechanism for code reuse, especially for boilerplate code or logic that will not
  change for any (or most) subclasses.
  The best strategy here is to have the ABC (i.e. parent class) do most of the work and
  have the children implement the specifics.

- Good for real time validation when creating an instance of a child class.
## Protocols

Protocols are not “implemented” but tell downstream code (i.e. other functions or
classes) what the structure of the input object is expected to be.

- Good for defining interfaces

- Good (really the only way) for specifying flexible [[Python Generics]] type bounds.

- Protocols only are useful if using type annotations and cannot be used in any other
  way (except for runtime_checkable).

- Use ABCs if you want to reuse code.
  Inheritance is not always the best method of code reuse but it can be quite useful.

- Use ABCs if you require strict class hierarchy (as in you need to use method
  resolution order or you need to check **subclasses**) in your application.

- Use ABCs if you will need several implementations of a class with several methods.

- Use Protocols for strict type annotations (i.e.only annotate the methods/attributes
  you need)

- Use Protocols for [[Python Generics]] bounds

- Use Protocols for abstract interfaces for 3rd party libraries

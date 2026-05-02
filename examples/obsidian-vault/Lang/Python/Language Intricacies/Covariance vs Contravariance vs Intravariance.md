---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---


To summarise, the concept of _variance_explains when one type can be substituted with another type

- Type variables that are _covariant
- _ can be substituted with a more specific type without causing errors
- Type variables that are _contravariant_ can be substituted with a more general type without causing errors
- Types where neither is possible are _invariant_

Among the common use cases in Python, the following is the behaviour

- Normal classes and types are _covariant_
- Mutable container types are _invariant_
- Read-only container types are _covariant_
- Function types are _contravariant_ with respect to the input types
- Function types are _covariant_ with respect to the output type


# Containers

```python 
from typing import Sequence

# Intravariant. Must take a list[Person]
def add_person(p: list[Person]) -> None:
    p.append(Person("Anjali"))

# Covariance allowed in Sequences (non-mutable )
def print_all(people: Sequence[Person]) -> None:
    for p in people:
        print(p.greet())

people: list[Employee] =[Employee('Aparna', 3)

print_all(people) # ✅ OK

add_person(people) # ❌ Wrong
for p in people:
    p.login()
```
More examples at [source](https://www.playfulpython.com/type-hinting-covariance-contra-variance/)

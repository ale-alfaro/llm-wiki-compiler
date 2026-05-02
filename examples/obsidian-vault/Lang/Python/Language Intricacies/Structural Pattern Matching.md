---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---


# Pattern Matching

Makes complex condition statements so much easier and readable. Under the hood it is just a bunch of `if` `else` statements so **it is slower than plain if statements** so if you want to optimize speed a better way than this and plain `if` do a pseudo jump table:

```python fold title:jump_table_dict.py
def f(): pass def g): pass def default): 
	pass
_switch_dict = {0: f, 1: g, 2: g, 3: f,}
def switch_dict_example(x):
	do_next = _switch_dict.get(x, default=default)
	do_next ()
```
This is faster `if` statements when `N` is large (how large? It needs to be profiled!)




Great advanced videos where examples come from: [python match talk](https://youtu.be/P3Qr2zReKJ0?si=QYk0WvL0s1kwHr36)

```python 
match obj:
case list() as list_obj:
	print (f'found list: (list_obj!r)')
case Element (tag='country') as country_obj:
	print (f'found country: (country_obj!r)')
case [a, b, c] if b > 3:
	print (f'found 3 element sequence: (objtr)')
case {'name': name,
'value': value, **more}:
	print (f'found name-value mapping: {obj!r}')
case unknown:
	print (f'could not parse object: {unknown!r)')
```
![[Python-match-statement.png]]

* OR parsing: `{python} case ['yes" | Y" | "on* | 'true" | *1"] as option:`

- ﻿﻿Parsing optional / remaining arguments: `{python}case [1, 2, *args]:`
`{python}Case [1, و , 4]:`
`{python}case (name':name, **more}:`

- ﻿﻿Instance parsing: `{python}case Element(tag='country, attrib= (name': name)):`
- ﻿﻿Mixing local variables and capturing variables:  

```python
case Call(func=Name(id= isinstance),args=[Name(id= params.varname), Name(id=typename) |):
```

From Raymond Hettinger's PyCon Italia 2022 [talk](https://youtu.be/ZTvwxXL37XI?si=GqSS8-kdVnXHk_kF)

1. Remember that cases are a big if/elif chain and the first matching case wins.
2. Order cases first for correctness. This means putting specific cases before general cases.
3. Order cases secondarily for speed. This means putting common cases before rare cases.
4. To replace a literal with a variable or expression, use the value pattern as shown in the next section.
5. If the cases are exhaustive, always add a catchall wildcard case. The catches errors for unexpected cases. More importantly, it catches cases when you accidentally use a variable in case statement when you needed a value pattern.

![[match-parse-json.png]]

# More advanced patterns
![[PatternMatchingTalk.pdf]]
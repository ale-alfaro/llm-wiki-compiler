---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Aesthetics

Not only can I do a left align or right align, I can also do a center align, and give it
a particular padding character.

```python
x = 'test'

f'{x:>10}' → '

test'

f'{x:*<8}'→ 'test****1

f'{х:=^8}'→'==test=='
```

And if you want the padding to be variable, just use another set of braces inside:

```python
x, n = 'test', 10

f'{x:~{n}) → '~~~test~~~'
```

# Debugging

```python
    print(f'the value is {str_value}')
    print(f'{num_value = }')
    print(f'{num_value % 2 = }')
```

# Conversions

```python
  print(f'{str_value!s}')
    print(f'{str_value!r}')
```

# Hex, Binary

```Python

>>> a = 42
>>> f"{a:x}" # hex
'2a'
>>> f"{a:X}" # hex (uppercase)
'2A'
>>> f"{a:b}" # binary '101010'
>>> f"'{a:c)" # ascii
I*1
>>> f"{a:o}" # octal
'52'
>>> f"{a:010b}" # combined with padding '0000101010'
```

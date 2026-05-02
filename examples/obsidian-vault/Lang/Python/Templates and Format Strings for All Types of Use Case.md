---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# File-based Templates

There’s two types of way to do templates in Python from files. They are named the same but one is more safe and controlled.
- `string.Template` - Older, simpler and is the best choice for most cases
- `string.templatelib.Template` - New (Python 3.14), Safer ( allows fine control on interpolation) and is mostly for HTML template management or other runtime template substitution/interpolation where the input must be sanitized 


> [!QUOTE] From the Python [docs](https://docs.python.org/3/tutorial/stdlib2.html#templating) on `string.Template`
> The string module includes a versatile Template class with a simplified syntax suitable for editing by end-users. This allows users to customize their applications without having to alter the application.
> 
> The format uses placeholder names formed by $ with valid Python identifiers (alphanumeric characters and underscores). Surrounding the placeholder with braces allows it to be followed by more alphanumeric letters with no intervening spaces. Writing $$ creates a single escaped $:
> 
> from string import Template
> t = Template('${village}folk send $$10 to $cause.')
> t.substitute(village='Nottingham', cause='the ditch fund')
> 'Nottinghamfolk send $10 to the ditch fund.'
> The substitute() method raises a KeyError when a placeholder is not supplied in a dictionary or a keyword argument. For mail-merge style applications, user supplied data may be incomplete and the safe_substitute() method may be more appropriate — it will leave placeholders unchanged if data is missing:
> 
> t = Template('Return the $item to $owner.')
> d = dict(item='unladen swallow')
> t.substitute(d)
> Traceback (most recent call last):
>   ...
> KeyError: 'owner'
> t.safe_substitute(d)
> 'Return the unladen swallow to $owner.'
> Template subclasses can specify a custom delimiter. For example, a batch renaming utility for a photo browser may elect to use percent signs for placeholders such as the current date, image sequence number, or file format:
> 
> import time, os.path
> photofiles = ['img_1074.jpg', 'img_1076.jpg', 'img_1077.jpg']
> class BatchRename(Template):
>     delimiter = '%'
> 
> fmt = input('Enter rename style (%d-date %n-seqnum %f-format):  ')
> Enter rename style (%d-date %n-seqnum %f-format):  Ashley_%n%f
> 
> t = BatchRename(fmt)
> date = time.strftime('%d%b%y')
> for i, filename in enumerate(photofiles):
>     base, ext = os.path.splitext(filename)
>     newname = t.substitute(d=date, n=i, f=ext)
>     print('{0} --> {1}'.format(filename, newname))
> 
> img_1074.jpg --> Ashley_0.jpg
> img_1076.jpg --> Ashley_1.jpg
> img_1077.jpg --> Ashley_2.jpg
> Another application for templating is separating program logic from the details of multiple output formats. This makes it possible to substitute custom templates for XML files, plain text reports, and HTML web reports
> 

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

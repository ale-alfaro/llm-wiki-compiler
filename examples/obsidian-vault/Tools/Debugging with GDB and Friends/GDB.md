---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

## Useful Resources[](https://interrupt.memfault.com/blog/gdb-for-firmware-1#useful-resources)

Finally, I’ll leave you with some useful GDB resources that I’ve referred to over the years:

- [Official GDB website and documentation](https://www.gnu.org/software/gdb/)
- [GDB Cheat Sheet](https://darkdust.net/files/GDB%20Cheat%20Sheet.pdf)
- [Using GDB with Nordic devices blog post](https://devzone.nordicsemi.com/b/blog/posts/using-gdb-with-nordic-devices)
- [8 gdb tricks you should know blog post](https://blogs.oracle.com/linux/8-gdb-tricks-you-should-know-v2)
- [10 things you can only do with GDB](https://devarea.com/10-things-you-can-only-do-with-gdb/)
- [GDB Tutorial: Some Cool Tips to Debug C/C++ Code](https://www.techbeamers.com/how-to-use-gdb-top-debugging-tips/)
- [Most tricky/useful commands for gdb debugger](https://stackoverflow.com/questions/1471226/most-tricky-useful-commands-for-gdb-debugger)

#### Writing a Custom Pretty Printer with GDB Python ([Source](https://interrupt.memfault.com/blog/automate-debugging-with-gdb-python-api#writing-a-custom-pretty-printer-with-gdb-python))

To add a custom pretty printer, we just need to:

- define a class that can detect whether or not pretty printing is supported given a particular type. The detector needs to define a `__call__` function which given a [`gdb.Value`](https://sourceware.org/gdb/onlinedocs/gdb/Values-From-Inferior.html#Values-From-Inferior) either returns a custom printer or `None` if it can’t handle the value.
- The printer class itself, which needs to define a `to_string`function that GDB will call to display the value.


```python custom_gdb_extensions.py
from gdb.printing import PrettyPrinter, register_pretty_printer
import gdb
import uuid

class UuidPrettyPrinter(object):
    """Print 'struct Uuid' as 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'"""

    def __init__(self, val):
        self.val = val

    def to_string(self):
        return "TODO: Implement"


class CustomPrettyPrinterLocator(PrettyPrinter):
    """Given a gdb.Value, search for a custom pretty printer"""

    def __init__(self):
        super(CustomPrettyPrinterLocator, self).__init__(
            "my_pretty_printers", []
        )

    def __call__(self, val):
        """Return the custom formatter if the type can be handled"""

        typename = gdb.types.get_basic_type(val.type).tag
        if typename is None:
            typename = val.type.name

        if typename == "Uuid":
            return UuidPrettyPrinter(val)
            
            
register_pretty_printer(None, CustomPrettyPrinterLocator(), replace=True)
```

> [!NOTE]
> 
> ```
> register_pretty_printer(None, CustomPrettyPrinterLocator(), replace=True)
> ```
> 
> The `replace=True` is useful while developing a pretty printer because when the script is re-source’d, it will overwrite the previous pretty printer version. 

```
(gdb) source custom_gdb_extensions.py
(gdb) info pretty-printer
global pretty-printers:
  builtin
    mpx_bound128
  my_pretty_printers
```

Now let’s try to print the head list node and see what we get:

```
(gdb) p *s_list_head
$1 = {
  next = 0x200070a8,
  uuid = TODO: Implement
}
```

# Load debug symbols onto a non-debug program

Use the `file <FILE-PATH>` command to load an elf

This can highkey be a game changer for most use cases. Need to experiment


# Examining Code
• Once the program is loaded in gdb, you can list any of the source files using the list command
- Options to list a `LINENUM, FILE: LINENUM, FUNCTION, FILE: FUNCTION Or *ADDRESS`
• You can specify the number of lines to list as a second parameter
- Defaults to 10 but can be changed with `set listsize <value>`
• You can change the options using the set command
- E.g., `set output-radix 16` would set the display radix to hexidecimal
- Use show to see the available options
- `help set ‹option>` to get help on the different options


![[GDB Cheat Sheet.pdf]]


# Remote Debugging

![[debugging-EALE-2018-csimmonds.pdf#page=5]]

[GDB C++](https://github.com/zaldawid/magic_powers_at_your_fingertips)


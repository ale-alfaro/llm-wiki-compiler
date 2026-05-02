---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
## Differences between them


| printk             | Logging                                                                            |
| ------------------ | ---------------------------------------------------------------------------------- |
| Instant            | Deferred or queued logging by default                                              |
| Raw  no formatting | Implicitly adds newline per log call, prefix with timestamp and other log metadata |
|                    |                                                                                    |


## Printk Format Specifiers

from the Linux kernel [docs](https://www.kernel.org/doc/html/latest/core-api/printk-formats.html)

```
If variable is of Type,         use printk format specifier:
------------------------------------------------------------
        signed char             %d or %hhx
        unsigned char           %u or %x
        char                    %u or %x
        short int               %d or %hx
        unsigned short int      %u or %x
        int                     %d or %x
        unsigned int            %u or %x
        long                    %ld or %lx
        unsigned long           %lu or %lx
        long long               %lld or %llx
        unsigned long long      %llu or %llx
        size_t                  %zu or %zx
        ssize_t                 %zd or %zx
        s8                      %d or %hhx
        u8                      %u or %x
        s16                     %d or %hx
        u16                     %u or %x
        s32                     %d or %x
        u32                     %u or %x
        s64                     %lld or %llx
        u64                     %llu or %llx
```

### Symbols/Function Pointers

| Specifier | Output Example                                                                         |
| --------- | -------------------------------------------------------------------------------------- |
| %pS       | versatile_init+0x0/0x110                                                               |
| %ps       | versatile_init                                                                         |
| %pSR      | versatile_init+0x9/0x110<br>        (with __builtin_extract_return_addr() translation) |
| %pB       | prev_fn_of_versatile_init+0                                                            |

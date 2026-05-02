---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

# Background

Very revealing presentation of Zephyr Devicetree and it use in Zephyr vs Linux kernel. 

[[Zephyr Device Tree - ELC2017.pdf|Zephyr Device Tree - ELC2017]]

[Video - Devicetree in Zephyr Project - Andy Gross](https://youtu.be/eOZ0_pNU5vg?si=7mme-AMEG_foqUvr)

More recent talk about the details of the device driver model that largely remains the same:

[A Dive into Zephyr Device Driver Model - Tomasz Bursztyka, Intel Corporation](https://youtu.be/RYbKALYRYCM?si=Q1ZK4YYacHg52vb6)

# Key Concepts

- **Nodes**: Each hardware component or subsystem is represented as a node.
- **Tree Structure**: Every node, except the root node /, has exactly one parent, forming a hierarchy.
- **Properties**: Nodes contain properties that define addresses, interrupts, compatibility strings, and other configuration details.

Some key properties you should be aware of:

- `compatible`: A crucial property that helps identify which driver should handle that node’s hardware.
- `status`: Indicates whether a device is enabled ("okay") or disabled ("disabled").
- `reg` and `interrupts`: Standard properties to specify memory-mapped addresses and interrupt lines for the device.

# Input/Output

There are two types of devicetree input files: *devicetree sources* (`dts` and `dtsi `.  ) and *devicetree bindings.*  (`yml` )The sources contain the devicetree itself. The bindings describe its contents, including data types.

The main output of the input files is `devicetree.h` the All Zephyr and application source code files can include and use `devicetree.h`. 

> The API itself is based on C macros. The macro names all start with DT_. In general, if you see a macro that starts with DT_ in a Zephyr source file, it’s probably a devicetree.h macro. The generated C header contains macros that start with DT_ as well; you might see those in compiler error messages. You always can tell a generated- from a non-generated macro: generated macros have some lowercased letters, while the devicetree.h macro names have all capital letters.
![Devicetree flow](https://docs.zephyrproject.org/latest/_images/zephyr_dt_build_flow.png)


# Syntax and Structure

```dts fold title:example_dts
/ {
        a-node {
                subnode_nodelabel: a-sub-node {
                        foo = <3>;
                };
        };
};
```


A DTS file is composed of:
- A version specifier `/dts-v1/;`
- A root node `/`
- Nodes - following a tree hierarchy, all of them child nodes of the root node, each can have:
	- Node labels - a short hand name that they can be referred to as
	- Path - similar to filesystem path - another way to address a node
	- Properties - key-value pairs that can hold different types of information about a node


![dts-structure-example](https://docs.zephyrproject.org/latest/_images/zephyr_dt_i2c_example.png)
>

# How does the Devicetree get compile in the FW

[Video](https://youtu.be/w8GgP3h0M8M?si=7r1bF3OlRC4FiXAu)

Watch next <https://youtu.be/sWaxQyIgEBY?si=vDVoF7yfmhEOF-uN>

## 1.a DTS and DTSI (device tree sources and includes):

- Define all possible devices in its own language

## 1.b Bindings:

- Converts device tree node to a C struct

![[Dts-compilation-5.png]]




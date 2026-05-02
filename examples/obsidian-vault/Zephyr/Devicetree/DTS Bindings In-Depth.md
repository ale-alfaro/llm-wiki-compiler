---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Overview of Keys


```yaml DTS_bindings_example.yaml

#

# description |

# A piece of content with 20 lines.

title: Concise title for the long description [optionall

L 4 high level description of the device the binding applies to:
description: |
This is the Vendomatic company's foo-device.

Descriptions which span multiple lines (like this) are OK,
and are encouraged for complex bindings.

See https://yaml-multiline.info/ for formatting help.

# You can include definitions from other bindings using this syntax:
include: other.yaml

# Used to match nodes to this binding:
compatible: "manufacturer,foo-device"

properties:
# Requirements for and descriptions of the properties that this
# binding's nodes need to satisfy go here.

child-binding:
# You can constrain the children of the nodes matching this binding
# using this key.

# If the node describes bus hardware, like an SPI bus controller
# on an SoC, use 'bus:' to say which one, like this:
bus: spi

# If the node instead appears as a device on a bus, like an external
# SPI memory chip, use 'on-bus:' to say what type of bus, like this.
# Like 'compatible', this key also influences the way nodes match

# bindings.

on-bus: spi

examples:
# You can put a sample node here showing how to use the binding.
#-
# ..

 # or
#

foo-cells:
# "Specifier" cell names for the 'foo' domain go here; example 'foo'
# values are 'gpio', 'pwm', and 'dma'. See below for more information.


```

# Some Stand Out Keys

## Child-binding

child-binding can be used when a node has children that all share the same properties. Each child gets the contents of child-binding as its binding, though an explicit compatible = ... on the child node takes precedence, if a binding is found for it.
Consider a binding for a PWM LED node like this one, where the child nodes are required to have a pwms property: i
```dts
pwmleds { 
	compatible = "pwm-leds"; 
	red_pwm_led { pwms = <&pwm3 4 15625000>; }; 
	green_pwm_led { pwms = <&pwm3 0 15625000>; }; 
	/* ... */ 
}; 
```



The binding would look like this: 
```yaml
compatible: "pwm-leds"
child-binding: 
	description: LED that uses PWM 
	properties: 
	  pwms: type: phandle-array 
	  required: true
```

## Include
Include Bindings can include other files, which can be used to share common property definitions between bindings. 
Use the `include:` key for this. Its value is either a string or a list. In the simplest case, you can include another file by giving its name as a string, like this:
```yaml
include: foo.yaml
```
If any file named `foo.yaml` is found (see Where bindings are located for the search process), it will be included into this binding. 
Included files are merged into bindings with a simple recursive dictionary merge. The build system will check that the resulting merged binding is well-formed. 
It is allowed to include at any level, including child-binding, like this:
```yaml

# foo.yaml will be merged with content at this level
include: foo.yaml

child-binding:
	# bar.yaml will be merged with content at this level
	include: bar.yaml
```


It is an error if a key appears with a different value in a binding and in a file it includes, with
one exception: a binding can have required: true for a property definition for which the in-
cluded file has required: false. The required: true takes precedence, allowing bindings to
strengthen requirements from included files.

Note that weakening requirements by having required: false where the included file has
required: trueis an error. This is meant to keep the organization clean.

The file base.yaml contains definitions for many common properties. When writing a new bind-
ing, it is a good idea to check if base.yaml already defines some of the needed properties, and
include it if it does.


Note that you can make a property defined in base.yaml obligatory like this, taking reg as an
example:
```yaml
reg:
	required: true
```

This relies on the dictionary merge to fill in the other keys for reg, like type.
To include multiple files, you can use a list of strings:
```yaml
include:
- foo.yaml
- bar.yaml

```
This includes the files foo.yaml and bar.yaml. (You can write this list in a single line of YAML as
include: [foo.yaml, bar.yaml].)

When including multiple files, any overlapping required keys on properties in the included files
are ORed together. This makes sure that a required: true is always respected.

In some cases, you may want to include some property definitions from a file, but not all of
them. In this case, include: should be a list, and you can filter out just the definitions you want
by putting a mapping in the list, like this:

```yaml
include:
	- name: foo.yaml
	property-allowlist:
		- i-want-this-one
		- and-this-one
	- name: bar.yaml
	property-blocklist:
		- do-not-include-this-one
		- or-this-one

```
Each map element must have a name key which is the filename to include, and may have
property-allowlist and property-blocklist keys that filter which properties are included.

You cannot have a single map element with both property-allowlist and property-blocklist
keys. A map element with neither property-allowlist nor property-blocklist is valid; no
additional filtering is done.

You can freely intermix strings and mappings in a single include: list:

``` yaml
include:
	- foo.yaml
	- name: bar.yaml
	property-blocklist:
		- do-not-include-this-one
		- or-this-one
```

Finally, you can filter from a child binding like this:

``` yaml
include:
	- name: bar.yaml
	child-binding:
		property-allowlist:
		- child-prop-to-allow
```


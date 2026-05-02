---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
<!--
**Style Guidelines:**

- Use bulleted lists with `-` instead of numbered lists for easy reordering
- Create headings without numbers (e.g., `### Install Package` not `### Step 1: Install Package`)
- Keep headings descriptive so steps can be rearranged without renumbering
- Use `####` subheadings for troubleshooting subsections instead of bold text with numbers

When referencing code or documentation:
- **Code**: Link to GitHub with line numbers: [`filename:line`](https://github.com/org/repo/blob/main/path/file.rb#L123)
- **Docs**: Link to official documentation: [Ruby Logger Documentation](https://ruby-doc.org/stdlib/libdoc/logger/rdoc/Logger.html)
- **Local**: Link to local docs: [Related How-to](../how_to_other_guide.md)
-->

# MFD Explained 

## Background

-  Why and how of design archived [here](https://github.com/zephyrproject-rtos/zephyr/issues/50621)
## Problem

> [!quote] From the main GH issue [48934](https://github.com/zephyrproject-rtos/zephyr/issues/48934)
> Currently, only one API can be mapped to each instance of a struct device. This proposal provides two solutions which together allow for multiple APIs pr device instance, and the creation of devices which consist of multiple sub devices.
> 
> 
> 
> ### Problem description
> 
> 
> 
> Some devices provide multiple functions, which require multiple APIs pr single device instance. Some devices consist of multiple internal devices, which all require their own handles and APIs. There is no general design guideline for creating such devices, and creating devices with multiple APIs pr instance is not currently possible. This is preventing the creation of proper drivers for cellular and GNSS modems which do provide many varying features which can not be efficiently covered by a single API, since the functionalities are ever expanding and vary highly between devices.
## Key Concepts

### Concept 1

Explain the first key concept...

**Code Location** (if relevant): Link to source code using format [`filename:line`](https://github.com/org/repo/blob/main/path/file.rb#L123)

### Concept 2

Explain the second key concept...

**Code Location** (if relevant): Link to source code using format [`filename:line`](https://github.com/org/repo/blob/main/path/file.rb#L123)

## Related Topics

For the following information make sure to add a URL link with location.  For example, if the reference is a git URL then include the full URL plus line numbers; if a website document then point to the appropriate document; if simply a reference to another local markdown document, then point to it locally:

- Link to related concepts.
- Link to relevant how-tos
- Link to reference docs
!![[res/OSS2023 - High Bandwidth Sensors.png]]

[[OSS2023 - High Bandwidth Sensors 1.pdf#page=1&rect=30,63,628,311|p.21]]
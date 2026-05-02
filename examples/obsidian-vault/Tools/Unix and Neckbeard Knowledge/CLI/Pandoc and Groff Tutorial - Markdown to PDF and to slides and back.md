---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
This is from 2 baller videos that are exactly what I needed:


| CLI Tool | TLDR                                    | Tutorial video                                           |     |
| -------- | --------------------------------------- | -------------------------------------------------------- | --- |
| Pandoc   |                                         | Link                                                     |     |
| Groff    | Linux GNU util replacement of Latex too | [Link](https://youtu.be/RW69tq7taXs?si=iflC9WYRQcvmTbNq) |     |
| Typst    | Direct replacement of Latex AND Pandoc  | [Link](https://youtu.be/kI2e0o3sIVM?si=NV5KZA1vih5VpSeV) |     |

- Pandoc video
-  video 
-  video
## Learning Objectives

- Learn what Pandoc and Groff do and the pros and  cons 
- How to use them in the CLI to make PDF and slides
- How to add metadata for themes and authorship and copyright  

## Prerequisites

Document used and [image](https://github.com/Phantas0s/mouseless-dev-youtube/blob/71a22e4c076af0688b4b4eb18f621b4202bc226a/pandoc/image.jpg) in tutorial 

```markdown title:document.md
---
title: Super Document™
author: YOU
rights: Copyright © you? 
lang: en-US
---

# This is a section

I love to [link](https://www.youtube.com/channel/UCoJtk2M8bme9KXTe6F3K-Yg) something.

* First point.
* Second point.
* Third point.

## Subsection

This is a **subsection**.

## Again a subsection

This is *another* subsection!

### Sub-subsection

And here's an image! 

![alt text](./image.jpg)

# SECOND FIRST LEVEL SECTION

I love to [link](https://www.youtube.com/channel/UCoJtk2M8bme9KXTe6F3K-Yg) something.

## Conclusion

Alright! Let's conclude.
```

## Tutorial from awesome [video](https://youtu.be/-S8-a_YS6tc?si=vb72Jrs29sNYnLwa)

1. Check the number of the supported formats for input and output documents

```sh
~/pandoc › pandoc --list-input-formats |
wC -1
39
```


```sh
~/pandoc › pandoc --list-output-formats | wc -l
61
```

2. Make a PDF 

```sh
~/pandoc > pandoc -f markdown -t pdf document.md -o document.pdf
```

3. Make slides from pdf 
```sh
~/pandoc › pandoc -t beamer -V theme=Berlin document.md -o document.pdf
```
## Related Resources

- [Pandoc](https://pandoc.org)
- Example - entire book written with markdown and rendered to PDF - [files](https://github.com/Phantas0s/mouseless-book-behind-scene)



------------------------

![[PRIVILEGE LEVELS.png]]

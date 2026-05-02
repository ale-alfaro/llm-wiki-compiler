---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

# macOS copy/paste commands
```sh
seq 4 | fzf --multi --bind 'result:select-all+become:cat {+f} | pbcopy'


# Output after running example 
~$:pbpaste
1
2
3
4
```



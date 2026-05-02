---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

| Placeholder | Description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `{}`        | current line, optionally with field index expression (e.g. `{1}, {2..}`) |
| `{n}`       | current line number (zero index)                                         |
| `{q}`       | current query                                                            |

| Placeholder   expression flags | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `+`                            | space-separated list of the selected lines     |
| `*`                            | space-separated list of **ALL** selected lines |
| f                              | temporary file                                 |
| r	unquoted output<br>          | unquoted output                                |
| s                              | preserve whitespace                            |
 

 
## one-liners
Highly recommend that to look at the following dot files [fzf scripts](https://github.com/Phantas0s/.dotfiles/blob/b6b706527704b372f3321fefd65e8f9410e33386/zsh/scripts_fzf.zsh) from the same guy who does the [Valuable Dev Fzf Guide](https://thevaluable.dev/practical-guide-fzf-example/) before diving into the examples he has the best pattern to make easy to understand and extend Fzf pickers

### Zoxide

```sh

j() {
    [ $# -gt 0 ] && z "$*" && return
    cd "$(z -l 2>&1 | fzf --height 40% --nth 2.. --reverse --inline-info +s --tac --query "${*##-* }" | sed 's/^[0-9,.]* *//')"
}
```
---
### Explorer done with Fzf

Sort of a one-liner but very useful to know for flags 

```sh
# An explorer

selection=$(find -type d | fzf --multi --height=80% --border=sharp \
--preview='tree -C {}' --preview-window='45%,border-sharp' \
--prompt='Dirs > ' \
--bind='del:execute(rm -ri {+})' \
--bind='ctrl-p:toggle-preview' \
--bind='ctrl-d:change-prompt(Dirs > )' \
--bind='ctrl-d:+reload(find -type d)' \
--bind='ctrl-d:+change-preview(tree -C {})' \
--bind='ctrl-d:+refresh-preview' \
--bind='ctrl-f:change-prompt(Files > )' \
--bind='ctrl-f:+reload(find -type f)' \
--bind='ctrl-f:+change-preview(cat {})' \
--bind='ctrl-f:+refresh-preview' \
--bind='ctrl-a:select-all' \
--bind='ctrl-x:deselect-all' \
--header '
CTRL-D to display directories | CTRL-F to display files
CTRL-A to select all | CTRL-x to deselect all
ENTER to edit | DEL to delete
CTRL-P to toggle preview
'
)

if [ -d "$selection" ]; then
    cd "$selection" || exit
else
    eval "$EDITOR $selection"
fi

```
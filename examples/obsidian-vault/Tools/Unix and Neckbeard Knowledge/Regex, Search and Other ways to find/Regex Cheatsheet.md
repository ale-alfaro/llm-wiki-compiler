---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
## Rules

*Character classes* - `.` Any character, except newline - `\w` Word - `\d` Digit - `\s`
Whitespace - `\W` Not word - `\D` Not digit - `\S` Not whitespace - `[abc]` matches a
single character that is either `a` `b` or `c` - `[a-f]` matches a single character that
is inclusively in the range between `a` and `f` - `[1-9]` Digit between 1 and 9 -
`[[:print:]]` Any printable character including spaces - `[^abc]` Any character except
a, b or c

*Anchors* \G Start of match ^ Start of string $ End of string \A Start of string \Z End
of string \z Absolute end of string \b A word boundary \B Non-word boundary

*Quantifiers* - `*` matches 0 to many of the previous thing - `+` matches 1 to many of
the previous thing - `?` matches 0 or 1 of the previous thing - `{n}` is an exact repeat
counter, `{2}` matches exactly two of the previous thing - `{,n}` matches 0 … n repeats
\- `{n,}` matches n … infinity repeats - `{n,m}` matches n … m repeats *Verbatim text* -
verbatim text is matched literally *Escapes* - `\` escape character - most cases, treat
the character after it as a literal character `\.` is `.` *Groups* - `|` exclusive or,
match one thing or the other - `(abc)` capture group mechanism - `(?:abc)` Match abc,
but don’t capture *Lookahead/Lookbehind* - `a(?=b) ` Match a in baby but not in bay -
`a(?!b) ` Match a in Stan but not in Stab - `(?<=a)b` Match b in crabs but not in cribs
\- `(?<!a)b` Match b in fib but not in fab

## Examples

```bash

~$ fd ".bak.\d+" --hidden --follow

    chromium-flags.conf.bak.1757117639
    chromium-flags.conf.bak.1761073028
    hypr/hyprlock.conf.bak.1761073036
    uwsm/env.bak.1761073036
    walker/config.toml.bak.1761073039
    waybar/config.jsonc.bak.1756938161
    waybar/config.jsonc.bak.1761073033
    waybar/style.css.bak.1756938161
[[JSON, YAML and others]]```

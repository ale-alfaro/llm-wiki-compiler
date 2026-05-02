---
aliases:
  - Variable Expansion
tags:
  - bash
  - zsh
title: Variable Expansion
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Variable Expansion

## Common Patterns

|Syntax|Behavior|Use Case|Example|
|---|---|---|---|
|`${var?}`|Error if unset|Required args or flags with defaults in usage spec|`${usage_profile?}`|
|`${var:?}`|Error if unset or empty|When you need to ensure non-empty values|`${usage_target:?}`|
|`${var:-default}`|Use default if unset|Boolean flags without `default=` in usage spec|`${usage_clean:-false}`|
|`${var:=default}`|Set and use default if unset|When you want to set the variable for later use|`${usage_dir:=.}`|
|`${var:+value}`|Use value if set|Conditional flag passing|`${usage_verbose:+--verbose}`|


`${var:-foo} ${var:=foo} ${var:+foo}`, also work without the colon. In that case they only react to unset variables. The colon makes them react to empty (null) variables, too.


## Guidelines for  Variables [​](#guidelines-for-usage-variables)

### Args and Flags with Defaults [​](#args-and-flags-with-defaults)

Use `${usage_var?}` since usage guarantees they'll be set:

```sh
# --profile has default="debug" in usage spec
cargo build --profile "${usage_profile?}"
```

### Boolean Flags without Defaults [​](#boolean-flags-without-defaults)

Use `${usage_var:-false}` to provide a default value:

```sh
# --clean flag has no default in usage spec
if [ "${usage_clean:-false}" = "true" ]; then
  cargo clean
fi
```

### Required Arguments [​](#required-arguments)

Use `${usage_var:?}` to ensure non-empty values:

```sh
# <target> is a required positional argument
cargo build --target "${usage_target:?}"
```

### Conditional Flags [​](#conditional-flags)

Use `${usage_var:+value}` to pass flags only when set:

```sh
# Only add --verbose if the flag was provided
mycli deploy ${usage_verbose:+--verbose}
```

These expansions help [shellcheck](https://www.shellcheck.net/) understand your script and prevent warnings about potentially unset variables while maintaining proper error handling.



[Video](https://youtu.be/f3eIK5xk4vg?si=gIPLU-UCbccEGJVB)

# Command Substitution (using Backticks `command` or `$(command)`)

runs a command and\
replaces it with the command's entire standard output (0:40, 2:26). The output is\
collected first and then used as a single string (2:18). This is useful when the\
command's output is small enough to fit comfortably in memory and you need to know the\
command's exit code (5:15, 5:21).

---

# Process Substitution (using `<(command)` or `>(command)`)

runs a command and replaces it\
with the name of a special file (often a FIFO pipe) that streams the command's output\
(2:56, 3:45). This allows processing the output as it becomes available, which is\
beneficial for large or continuous data streams, like logs or network data (4:57, 5:29).\
However, you cannot directly get the command's exit code because the data is processed\
while the command might still be running (5:40, 5:47).

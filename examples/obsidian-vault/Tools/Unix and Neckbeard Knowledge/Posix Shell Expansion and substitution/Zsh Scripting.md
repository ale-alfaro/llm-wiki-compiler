---
theme: theme.json
author: Cloud-Native Corner
date: MMMM dd, YYYY
paging: Slide %d / %d
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

# Techniques

## Reading a file or subcommand with multi-line or space separated output into an array

```
typeset -a lineslines=( "${(@f)"$(<path/file)"}" )
```

This preserves empty lines because of double-quoting (the outside one). `@`-flag is used to obtain an array instead of a scalar. If you don't want empty lines preserved, you can also skip `@`-splitting, as is explained in the [Information](https://wiki.zshell.dev/community/zsh_handbook#information) section:

```
typeset -a lineslines=( ${(f)"$(<path/file)"} )
```

Note: `$(<...)` construct strips trailing empty lines.

<iframe src=https://wiki.zshell.dev/community/zsh_handbook#information, height=600, width=800></iframe>


# Variables Parameters Expansion

| Description                                                   | Syntax             |
| ------------------------------------------------------------- | ------------------ |
| Get the value of a variable whose name is in another variable | `${(P)NAMEVAR}`    |
| Get the list of all defined variables, as an array            | `${(k)parameters}` |
| Delete a variable                                             | `unset VARNAME`    |


## Strings

| Description                                      | Syntax                              |
| ------------------------------------------------ | ----------------------------------- |
| Get the length of a string                       | `${#VARNAME}`                       |
| Get a single character                           | `${VARNAME[index]}`                 |
| Get the string from a specific index             | `${VARNAME[index,-1]}`              |
| Get a substring                                  | `${VARNAME[from,to]}`               |
| Replace the first occurrence in a string         | `${VARNAME/toreplace/replacement}`  |
| Replace all occurrences in a string              | `${VARNAME//toreplace/replacement}` |
| Cut a string after a model                       | `${VARNAME%%model*}`                |
| Check if a string starts by a specific substring | `if [[ $VARNAME = "startstr"* ]]`   |
| Check if a string contains a substring           | `if [[ $VARNAME = *"substring"* ]]` |
| Check if a string ends by a specific substring   | `if [[ $VARNAME = *"substring" ]]`  |
|                                                  |                                     |
## Parameter (Variable) Expansion

Basic forms: Str will also be expanded; most forms work on words of array separately:

| Pattern         | Description                                    |
| --------------- | ---------------------------------------------- |
| ${var}          | Substitute contents of var, no splitting       |
| ${+var}         | if var is set, else 0                          |
| ${var:-str}     | $var if non-null, else _str_                   |
| ${var-str}      | $var if set (even if null) else _str_          |
| ${var:=str}     | $var if non-null, else _str_ and set var to it |
| ${var: :=str}   | Same but always use _str_                      |
| ${var:?str}     | $var if non-null else error, abort             |
| ${var:+str}     | _str_ if $var is non-null                      |
| ${var#pat}      | min match of _pat_ removed from head           |
| ${var##pat}     | max match of _pat_ removed from head           |
| ${var%pat}      | min match of _pat_ removed from tail           |
| ${vark%%pat}    | max match of pat removed from tail             |
| ${var:#pat}     | $var unless _pat_ matches, then empty          |
| ${var/p/r}      | One occurrence of _p_ replaced by _r_          |
| ${var//p/r}     | All occurrences of _p_ replaced by _r_         |
| ${#var}         | Length of var in words (array) or bytes        |
| ${^var}         | Expand elements like brace expansion           |
| ${=var}         | Split words of result like lesser shells       |
| ${~var}         | Allow globbing, file expansion on result       |
| `${${var%p}#q}` | Apply `%p` then `#qto $var`                    |

### Parameter Flags
Parameter flags in parentheses, immediately after left brace:

| Parameter Flags | Description                                   |
| --------------- | --------------------------------------------- |
| %               | Expand %s in result as in prompts             |
| @               | Array expand even in double quotes            |
| A               | Create array parameter with ${...=...}        |
| a               | Array index order, so 0a is reversed          |
| c               | Count characters for ${#var}                  |
| C               | Capitalize result                             |
| e               | Do parameter, comand, arith expansion         |
| f               | Split result to array on newlines             |
| F               | Join arrays with newlines between elements    |
| i               | or 01 sort case independently                 |
| k               | For associative array, result is keys         |
| L               | Lower case result                             |
| n               | on or 0n sort numerically                     |
| o               | Sort into ascending order                     |
| O               | Sort into descending order                    |
| P               | Interpret result as parameter name, get value |

> [!NOTE]  Order of rules: 
> 1. Nested substitution: from inside out 
> 2. Subscripts: ${arr[3]} extract word; ${str[2]} extract character; ${arr[2,4]}, ${str[4,8]} extract range; -1 is last word/char, -2 previous etc.
> 3. ${(P)var} replaces name with value
> 4. ¨$array¨ joins array, may use (j:str:)
> 5. Nested subscript e.g. ${${var[2,4]}[1]}
> 6. #, %, / etc. modifications
> 7. Join if not joined and (j:str:), (F)
> 8. Split if (s), (z), (z), =
> 9. Split if SH_WORD_SPLIT
> 10. Apply (u) 
> 11. Apply (o), (O) 
> 12. Apply (e) 
> 13. Apply (l.str.), (r.str.) 
> 14. If single word needed for context, join with $IFS[1]]])


## Arrays

| Description                                                       | Syntax                           |
| ----------------------------------------------------------------- | -------------------------------- |
| Create an array                                                   | `VARNAME=()`                     |
| Create an array with initial values                               | `VARNAME=(value1 value2 value3)` |
| Push to an array                                                  | `VARNAME+=(value)`               |
| Access an array's element                                         | `VARNAME[index]`                 |
| Remove first element from an array (shift)                        | `shift VARNAME`                  |
| Remove last element from an array (pop)                           | `shift -p VARNAME`               |
| Get an array's length                                             | `${#VARNAME}`                    |
| Iterate over an array's values                                    | `for value in $VARNAME;`         |
| Get index of a value in an array (`0` if not found)               | `${VARNAME[(Ie)value]}`          |
| Get index of a value in an array (`${#VARNAME} + 1` if not found) | `${VARNAME[(ie)value]}`          |
| Get an array slice *after* the specified index                    | `${VARNAME:index}`               |
| Get an array slice *after* the specified index                    | `${VARNAME:index:length}`        |
| Check if a value is contained in an array                         | `if (( $VARNAME[(Ie)value] ));`  |
| Check if an array is empty                                        | `if [[ -z $VARNAME ]]`           |
| Check if an array is not empty                                    | `if [[ ! -z $VARNAME ]]`         |
| Remove an element from an array                                   | `VARNAME[index]=()`              |

## Associative arrays (= maps / dictionaries)

Associate arrays are the equivalent of hash maps or dictionaries in many other
programming languages: unlike arrays, they can use string keys, and these don’t
necessary have an order.

| Description                                     | Syntax                                               |
| ----------------------------------------------- | ---------------------------------------------------- |
| Create an associative array                     | `typeset -A VARNAME=()`                              |
| Create an associative array with initial values | `typeset -A VARNAME=( [key1]=value1 [key2]=value2 )` |
| Add a new key to the array                      | `VARNAME[key]=value`                                 |
| Access the array's elements                     | `$VARNAME[key]`                                      |
| Remove a key from the array                     | `unset 'VARNAME[key]'`                               |
| Get the array's number of elements              | `${#VARNAME}`                                        |
| Iterate over the array's values                 | `for value in $VARNAME;`                             |
| Iterate over the array's keys                   | `for key in ${(k)VARNAME};`                          |
| Iterate over the array's key-value pairs        | `for key value in ${(kv)VARNAME};`                   |

---
# Functions and Control Flow

| Description                                                       | Syntax                         |
| ----------------------------------------------------------------- | ------------------------------ |
| Declare a local variable (not accessible outside the function)    | `local varname=...`            |
| Get the original executable name                                  | `$0`                           |
| Get a parameter                                                   | `$1` (second is `$2`, etc.)    |
| Expand all parameters                                             | `$*`                           |
| Expand all parameters but keep them quoted if needed              | `$@` (tip: it's an array!)     |
| Get the number of parameters (so not counting `$0`)               | `$#`                           |
| Remove the first parameter from `$@`                              | `shift`                        |
| Remove the last parameter from `$@`                               | `shift -p`                     |
| Exit the function with a status code (behaves like for a command) | `return 1` (or any other code) |
| Get the list of all functions, as an array                        | `${(k)functions}`              |

## Conditionals

[A word on conditionals](#a-word-on-conditionals)

Syntaxes:

```zsh
# 1)
if expression
then
    # instructions
fi

# 2)
if expression; then
    # instructions
fi

# 3)
if expression; then ...; fi

# 4)
if expression; then
    # instructions
else
    # instructions
fi

# 5)
if expression; then
    # instructions
elif expression
    # instructions
else
    # instructions
fi
```

| Description                                                     | Syntax                       |
| --------------------------------------------------------------- | ---------------------------- |
| Check if a string is empty or not defined                       | `if [[ -z $VARNAME ]];`      |
| Check if a string is defined and not empty                      | `if [[ -n $VARNAME ]];`      |
| Check if a file exists                                          | `if [[ -f "filepath" ]];`    |
| Check if a directory exists                                     | `if [[ -d "dirpath" ]]; `    |
| Check if a symbolic link exists                                 | `if [[ -L "symlinkpath" ]];` |
| Check if a shell option is set                                  | `if [[ -o OPTION_NAME ]];`   |
| Check if two values are equal                                   | `if [[ $VAR1 = $VAR2 ]];`    |
| Check if two values are different                               | `if [[ $VAR1 != $VAR2 ]];`   |
| Check if a number is greater than another                       | `if (( $VAR1 > $VAR2 ));`    |
| Check if a number is smaller than another                       | `if (( $VAR1 < $VAR2 ));`    |
| Check if a command exits successfully (exit code `0`)           | `if command arg1 arg2 ...`   |
| Check if a command doesn't exit successfully (exit code != `0`) | `if ! command arg1 arg2 ...` |

Note that the `$` symbol preceding variables’ names in arithmetic expression (`((...))`)
are purely optional, so you can perfectly write `if (( VAR1 < VAR2 ));` for instance.

You can read all dash `-` options in ZSH’s manual, as there are many different ones:
http://zsh.sourceforge.net/Doc/Release/Conditional-Expressions.html

## Loops

Syntaxes:

```zsh
# 1)
for itervarname in iterable
do
    # instructions
done

# 2)
for itervarname in iterable; do
    # instructions
done

# 3)
for itervaname in iterable; do ...; done
```

| Description                                                              | Syntax                     |
| ------------------------------------------------------------------------ | -------------------------- |
| Iterate over a range (inclusive)                                         | `for i in {from..to};`     |
| Iterate over a list of filesystem items                                  | `for i in globpattern;`    |
| Iterate over a list of filesystem items, fail silently if no match found | `for i in globpattern(N);` |


Return a value from within a function:

```zsh
function add() {
    local sum=$(($1 + $2))
    echo $sum
}

function add_twice() {
    local sum=$(add $1 $2) # get the callee's STDOUT
    local sum_twice=$(add $sum $sum)
    echo $sum_twice
}

echo $(add 2 3) # 5
echo $(add_twice 2 3) # 10
```

## A word on conditionals

Conditionals use expressions, such as in `if [[ -z $VARNAME ]];` the expression is `[[ -z $VARNAME ]]`. These can also be used in `while` loops, as well as be used outside of blocks:

```zsh
[[ -z $VARNAME ]] && echo "VARNAME is not defined or empty!"
[[ -f $FILEPATH ]] && echo "File exists!"
```

This works because conditional expressions (`[[ ... ]]` and `(( ... ))`) don’t actually
return a value; they behave like commands and as such set the status code to `0` if the
condition is true, or `1` else.

If we want to display the message only if the condition is falsey:

```zsh
[[ -z $VARNAME ]] || echo "VARNAME is not empty!"
[[ -f $FILEPATH ]] || echo "File does not exist!"
```

---
# Misc
## Arithmetics

| Description                                                                            | Syntax            |
| -------------------------------------------------------------------------------------- | ----------------- |
| Compute a mathematical expression (variables don't need to be prefixed with `$` in it) | `$((expression))` |

## Aliases

| Description                                      | Syntax                                    |
| ------------------------------------------------ | ----------------------------------------- |
| Display the list of all defined aliases          | `alias`                                   |
| Get the list of all defined aliases, as an array | `${(k)aliases}`                           |
| Define an alias                                  | `alias name="command arg1 arg2 arg3 ..."` |
| Remove an alias                                  | `unalias name`                            |
| Get the arguments, with escaped spaces           | `${@:q}`                                  |


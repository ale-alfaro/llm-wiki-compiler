---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
[You suck at programming video ](https://youtu.be/aXovP1sUtoE?si=DpI5FFXo_liBdDaT)

## What signals are there?

```bash
dave@ysap $ trap -l
1) SIGHUP
2)SIGINT
2) SIGTRAP
3) SIGABRT
7)SIGEMT
10)SIGBUS
11)SIGSEGV
12)SIGSYS
15)SIGTERM
4) SIGQUIT
5) SIGFPE
6) SIGPIPE
7) SIGTSTP
8) SIGIO
9) SIGWINCH
10) SIGI
11) SIGK
12) SIGA
13) SIGC
14) SIGX
15) SIGI
```

## What do you use them for?

You can catch the signal and have a callback to handle it

```
#!/usr/bin/env bash

cleanup() {
	echo cleanup function running
}

trap cleanup exit

echo script starting
echo ...
echo script done
```

More examples at
https://github.com/bahamas10/ysap/blob/main/episodes/pt064-trap/00-simple-exit

---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
![[Pasted image 20251114212230.png]]

- Don’t use else statement.
  It is confusing for ppl who don’t know what it means.
  You can just decent the code there and it will run the same

- `Raise` vs `Raise e` in an except statement are the same.
  There’s a slight performance advantage by not re-raising `e`

- Catch exception you expect.
  Never use a bare `except` as it catches all exceptions.

- The `BaseException` is the most general exception one should ever use and even then
  don’t use it if you can

# Clean-up in Finally

**Very Important to use this with ContexManager, specially Async ones**

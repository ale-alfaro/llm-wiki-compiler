---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

# Tools

## Builtins (cProfile)

```python

def main():
    import cProfile
    import pstats

    with cProfile.Profile() as pr:
        asyncio.run(better_count_https_in_web_pages())

    stats = pstats.Stats(pr)
    stats.sort_stats(pstats.SortKey.TIME)
    # stats.print_stats()
    stats.dump_stats(filename='needs_profiling.prof')
```
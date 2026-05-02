---
id: 1763442543-SDUL
aliases:
  - multiprocessing
tags:
  - python
  - lib
  - io
  - async
  - parallelism
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Example

Use when doing computational intensive tasks over asyncio 

[mCoding](https://github.com/mCodingLLC/VideosSampleCode/blob/master/videos/104_multiprocessing_pool/multiprocessing_pool.py#L5-L86)

```Python
from multiprocessing import Pool


def etl_demo():
    filenames = [f"sounds/example{n}.wav" for n in range(24)]

    print("starting etl")
    with Pool() as pool:
        results = pool.map(etl, filenames)

def run_normal(items, do_work):
    results = list(map(do_work, items))
    return results


def run_with_mp_map(items, do_work, processes=None, chunksize=None):
    print(f"running using multiprocessing with {processes=}, {chunksize=}")
    with Pool(processes=processes) as pool:
        results = pool.imap(do_work, items, chunksize=chunksize)
    return results


```
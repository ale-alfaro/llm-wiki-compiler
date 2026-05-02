---
tags:
  - python
  - examples
  - lib
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Examples

## Starmap! … and Product

```python

def example_starmap():
    # starmap(function, iterable_of_arg_tuples)

    def add(x, y):
        return x + y

    points = [(1, 2), (3, 4), (5, 6)]

    result = list(itertools.starmap(add, points))
    assert result == [3, 7, 11]

    result = [add(*point) for point in points]  # starmap
    result = [add(x, y) for x, y in zip(xs, ys)]  # map

 def example_product():
    # product(*iterables, repeat=1)
    # repeat=n means product(*iterables, *iterables, ... [n times])
    data1 = [1, 2]
    data2 = ["a", "b", "c"]
    result = list(itertools.product(data1, data2))
    assert result == [
        (1, "a"),
        (1, "b"),
        (1, "c"),
        (2, "a"),
        (2, "b"),
        (2, "c"),
    ]

    for x in data1:
        for y in data2:
            for x2 in data1:
                for y2 in data2:
                    print(x, y)
```
## Group, batch

```python

def example_groupby():
    # groupby(iterable, key=None)
    data = [("a", 1), ("a", 2), ("b", 3), ("b", 4), ("c", 5), ("a", 6)]
    grouped = itertools.groupby(data, key=lambda x: x[0])
    result = [(key, list(group)) for key, group in grouped]
    assert result == [
        ("a", [("a", 1), ("a", 2)]),
        ("b", [("b", 3), ("b", 4)]),
        ("c", [("c", 5)]),
        ("a", [("a", 6)]),
    ]

    grouped = itertools.groupby(data, key=lambda x: x[0])
    for key, group in grouped:
        vals = list(group)

# new in 3.12
def example_batched():
    # batched(iterable, batch_size)
    values = list(itertools.batched(range(1, 11), 3))
    assert values == [(1, 2, 3), (4, 5, 6), (7, 8, 9), (10,)]



# new in 3.10!
def example_pairwise():
    # pairwise(iterable)
    data = [1, 2, 3, 4, 5]
    pairs = list(itertools.pairwise(data))
    assert pairs == [(1, 2), (2, 3), (3, 4), (4, 5)]
```
## Chain

```python chain

def example_chain():
    # chain(*iterables)
    values = list(itertools.chain([1, 2, 3], [4, 5], [6, 7, 8]))
    assert values == [1, 2, 3, 4, 5, 6, 7, 8]

    for task in itertools.chain(high_p, med_p, low_p):
        do_task(task)


def example_chain_from_iterable():
    # chain.from_iterable(iterable_of_iterables)
    iterables = get_iterables()
    values = list(itertools.chain.from_iterable(iterables))
    assert values == [1, 2, 3, 4, 5, 6, 7, 8]
```

## Filter, drop

```python drop
def example_compress():
    # compress(iterable, selectors)
    # filter(predicate, iterable)
    data = [1, 2, 3, 4, 5]
    selectors = [True, False, True, False, True]
    values = list(itertools.compress(data, selectors))
    assert values == [1, 3, 5]


def example_dropwhile():
    # dropwhile(predicate, iterable)
    data = [1, 2, 3, 4, 5, 1, 2, 3]
    result = list(itertools.dropwhile(lambda x: x < 3, data))
    assert result == [3, 4, 5, 1, 2, 3]


def example_filterfalse():
    # filterfalse(predicate, iterable)
    data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    result = list(itertools.filterfalse(lambda x: x % 2 == 0, data))
    assert result == [1, 3, 5, 7, 9]
```

## Take (filter +ve)

```python take


def example_takewhile():
    # takewhile(predicate, iterable)
    data = [1, 2, 3, 4, 5, 1, 2, 3]
    result = list(itertools.takewhile(lambda x: x < 3, data))
    assert result == [1, 2]
```

## Misc …. and unsure

```python

def example_accumulate():
    # accumulate(iterable, func=operator.add)
    values = list(itertools.accumulate([1, 2, 3, 4, 5]), max)
    assert values == [1, 2, 3, 4, 5]

def example_islice():
    # islice(iterable, start, stop, step=1)
    # islice(iterable, stop)
    data = (x for x in range(10))
    sliced = itertools.islice(data, 2, 8, 2)
    result = list(sliced)
    assert result == [2, 4, 6]



def example_tee():
    # tee(iterable, n)
    data = [1, 2, 3, 4, 5]
    it1, it2 = itertools.tee(data, 2)
    values1 = list(it1)
    values2 = list(it2)
    assert values1 == [1, 2, 3, 4, 5]
    assert values2 == [1, 2, 3, 4, 5]


def example_zip_longest():
    # zip_longest(*iterables, fillvalue=None)
    data1 = [1, 2, 3]
    data2 = ["a", "b"]
    result = list(zip(data1, data2, strict=True))  # EXCEPTION
    assert result == [(1, "a"), (2, "b"), (3, "")]
```

## Simple

```python
def example_count():
    # count(start=0, step=1)
    counter = itertools.count(start=10, step=2)
    values = [next(counter) for _ in range(5)]
    assert values == [10, 12, 14, 16, 18]

    for x in itertools.count(start=10, step=2):
        ...


def example_cycle():
    # cycle(iterable)
    cycler = itertools.cycle(["A", "B", "C"])
    values = [next(cycler) for _ in range(6)]
    assert values == ["A", "B", "C", "A", "B", "C"]


def example_repeat():
    # repeat(object, [n=infinity])
    repeater = itertools.repeat("X", 4)
    values = list(repeater)
    assert values == ["X", "X", "X", "X"]
```

## Combinations + Permutations

```python

def example_permutations():
    # permutations(iterable, [perm_length=len(iterable)])
    data = ["a", "b", "c"]
    result = list(itertools.permutations(data, 2))
    assert result == [
        ("a", "b"),
        ("a", "c"),
        ("b", "a"),
        ("b", "c"),
        ("c", "a"),
        ("c", "b"),
    ]


def example_combinations():
    # combinations(iterable, comb_length)
    data = ["a", "b", "c", "d"]
    result = list(itertools.combinations(data, 2))
    assert result == [
        ("a", "b"),
        ("a", "c"),
        ("a", "d"),
        ("b", "c"),
        ("b", "d"),
        ("c", "d"),
    ]


def example_combinations_with_replacement():
    # combinations_with_replacement(iterable, comb_length)
    data = ["a", "b", "c"]
    result = list(itertools.combinations_with_replacement(data, 2))
    assert result == [
        ("a", "a"),
        ("a", "b"),
        ("a", "c"),
        ("b", "b"),
        ("b", "c"),
        ("c", "c"),
    ]
```

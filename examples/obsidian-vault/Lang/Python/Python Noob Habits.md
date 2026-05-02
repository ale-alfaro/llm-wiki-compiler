---
id: Python Noob Habits
aliases: []
tags:
  - top
  - python
  - mistakes
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
[1st mCoding Video](https://youtu.be/qUeud6DvOWI?si=QnIdCV7-n32ZLnTs)

## MY NOOB HABITS

Things I’ve done that were mistakes

### Not sorting when using Itertools.groupby

[Link to article](https://www.thepythoncodingstack.com/p/read-the-docs-itertools-groupby-python)

Groups are made lazily and are ‘breaks’ are made whenever an element that doesn’t belong
to the group is encountered If the iterable is not sorted the groups will have breaks in
places that they shouldn’t.

Simple example, grouping by the length of a string:

```python

# BAD!

names = ["Stephen", "Bob", "Jane", "Mary", "James", "Ishaan", "Max"]
output = itertools.groupby(names, key=len)
for word_length, groups in output:
    print(word_length, list(groups))

# 7 ['Stephen']
# 3 ['Bob']
# 4 ['Jane', 'Mary']
# 5 ['James']
# 6 ['Ishaan']
# 3 ['Max']

# GOOD EXAMPLE:

sorted_names = sorted(names, key=len)
output = itertools.groupby(sorted_names, key=len)
for word_length, groups in output:
    print(word_length, list(groups))

# 3 ['Bob', 'Max']
# 4 ['Jane', 'Mary']
# 5 ['James']
# 6 ['Ishaan']
# 7 ['Stephen']
```

## Noob habits from mCoding Video

```python
import logging
import socket
import subprocess
import time
from collections import namedtuple

import numpy as np


def finally_instead_of_context_manager(host, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.connect((host, port))
        s.sendall(b'Hello, world')
    finally:
        s.close()

    # close even if exception
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        s.sendall(b'Hello, world')


def bare_except():
    while True:
        try:
            s = input("Input a number: ")
            x = int(s)
            break
        except:  # oops! can't CTRL-C to exit
            print("Not a number, try again")

    while True:
        try:
            s = input("Input a number: ")
            x = int(s)
            break
        except Exception:  # still better to use ValueError
            print("Not a number, try again")


def caret_and_exponentiation(x, p):
    y = x ^ p  # bitwise xor of x and p, not exponentiation
    y = x ** p


def mutable_default_arguments():
    def append(n, l=[]):
        l.append(n)
        return l

    l1 = append(0)  # [0]
    l2 = append(1)  # [0, 1]

    def append(n, l=None):
        if l is None:
            l = []
        l.append(n)
        return l

    l1 = append(0)  # [0]
    l2 = append(1)  # [1]

def never_using_comprehensions():
    squares = {}
    for i in range(10):
        squares[i] = i * i

    # same
    odd_squares = {i: i * i for i in range(10)}

def always_using_comprehensions(a, b, n):
    """matrix product of a, b of length n x n"""
    c = [
        sum(a[n * i + k] * b[n * k + j] for k in range(n))
        for i in range(n)
        for j in range(n)
    ]

    c = []
    for i in range(n):
        for j in range(n):
            ij_entry = sum(a[n * i + k] * b[n * k + j] for k in range(n))
            c.append(ij_entry)

    return c

def checking_type_equality():
    Point = namedtuple('Point', ['x', 'y'])
    p = Point(1, 2)

    if type(p) == tuple:
        print("it's a tuple")
    else:
        print("it's not a tuple")

    # probably meant to check if is instance of tuple
    if isinstance(p, tuple):
        print("it's a tuple")
    else:
        print("it's not a tuple")


def equality_for_singletons(x):
    if x == None:
        pass

    if x == True:
        pass

    if x == False:
        pass

    # better
    if x is None:
        pass

    if x is True:
        pass

    if x is False:
        pass

def checking_bool_or_len(x):
    if bool(x):
        pass

    if len(x) != 0:
        pass

    # usually equivalent to
    if x:
        pass

def range_len_pattern():
    a = [1, 2, 3]
    for i in range(len(a)):
        v = a[i]
        ...

    # instead
    for v in a:
        ...

    # or if you wanted the index
    for i, v in enumerate(a):
        ...

    # using i to sync between two things?
    b = [4, 5, 6]
    for i in range(len(b)):
        av = a[i]
        bv = b[i]
        ...

    # instead use zip
    for av, bv in zip(a, b):
        ...

def for_key_in_dict_keys():
    d = {"a": 1, "b": 2, "c": 3}
    for key in d.keys():
        ...

    # that's the default
    for key in d:
        ...

    # or if you meant to make a copy of keys
    for key in list():
        ...

def not_using_dict_items():
    d = {"a": 1, "b": 2, "c": 3}
    for key in d:
        val = d[key]
        ...

    for key, val in d.items():
        ...

def tuple_unpacking():
    x = 0
    y = 1

    tmp = x
    x = y
    y = tmp

    x, y = 0, 1
    x, y = y, x

    mytuple = 1, 2
    x = mytuple[0]
    y = mytuple[1]

    x, y = mytuple


def index_counter_variable():
    l = [1, 2, 3]

    i = 0
    for x in l:
        ...
        i += 1

    for i, x in enumerate(l):
        ...

def timing_with_time():
    start = time.time()
    time.sleep(1)
    end = time.time()
    print(end - start)

    # more accurate
    start = time.perf_counter()
    time.sleep(1)
    end = time.perf_counter()
    print(end - start)



def print_vs_logging():
    print("debug info")
    print("just some info")
    print("bad error")

    # versus
    # in main
    level = logging.DEBUG
    fmt = '[%(levelname)s] %(asctime)s - %(message)s'
    logging.basicConfig(level=level, format=fmt)

    # wherever
    logging.debug("debug info")
    logging.info("just some info")
    logging.error("uh oh :(")

def subprocess_with_shell_true():
    subprocess.run(["ls -l"], capture_output=True, shell=True)

    subprocess.run(["ls", "-l"], capture_output=True)

def not_using_numpy_pandas():
    x = list(range(100))
    y = list(range(100))
    s = [a + b for a, b in zip(x, y)]

    # better (faster)
    x = np.arange(100)
    y = np.arange(100)
    s = x + y
```

https://youtu.be/E8NijUYfyus?si=0ssX3D4bSDW6uF-D
```python

import collections
import dataclasses
import gzip
import io
import json
import math
import pathlib
import re
import typing
from html.parser import HTMLParser

import numpy as np


# 1
def manually_rounding_in_print():
    t = 1.23456
    print(f"Finished in {t}s")
    print(f"Finished in {round(t, 2)}s")
    print(f"Finished in {t:.2f}s")

# 2
def repeatedly_converting_to_from_numpy_arrays():
    nums = list(range(256 * 256 * 256))
    arr = np.array(nums)  # 1.01s

    m = max(nums)  # .16s
    m = np.max(arr)  # .01s
    m = arr.max()  # .01s
    m = max(arr)  # .73s

# 3
def manipulating_paths_as_strings():
    path = "path/to/data/my_data.json"
    zipped_file = path.removesuffix(".json") + ".zip"
    data_dir = "/".join(path.split("/")[-2])
    other_file = f"{data_dir}/other_file.txt"
    deeper_dir = f"{data_dir}/abc/def"

    path = pathlib.Path("path/to/data/my_data.json")
    zipped_file = path.with_suffix(".zip")
    data_dir = path.parent
    other_file = path.with_name("other_file.txt")
    deeper_dir = data_dir.joinpath("abc", "def")

    # also os.path but pathlib is preferred

# 4
def do_io_taking_path(path: str):
    with open(path, "w") as fp:
        fp.write("...")
        # do_io_taking_io(fp)


def do_io_taking_io(fp: typing.TextIO):
    fp.write("...")


def calls_do_io_with_gzip_io():
    with gzip.open("example.txt.gz", "wt") as fp:
        do_io_taking_io(fp)

    with gzip.open("example.txt.gz", "rt") as fp:
        assert fp.read() == "..."

# 5
def concatenating_strings_with_plus():
    s = ""
    for i in range(100):
        s += f"some string {i}" # bad is this will create copies

    ss = io.StringIO()
    for i in range(100):
        ss.write(f"some string {i}")
    s = ss.getvalue()

    lines = []
    for i in range(100):
        lines.append(f"some string {i}")
    s = "\n".join(lines)

    return s

# 6
def using_eval_as_a_parser():
    data_str = '{"a":1, "b":2, "c":3}'
    data = eval(data_str)
    data = json.loads(data_str)
    with open("file_that_data_str_came_from.txt") as fp:
        data = json.load(fp)
    print(data)
    # pydantic...



# 7
strict = True


def storing_inputs_and_or_outputs_as_globals():
    for i in range(100):
        if strict:
            ...
        else:
            ...

    global ans
    ans = ...

# SELF PROMO

# 8
def thinking_and_or_return_bools():
    a = {"a": 1, "b": 2, "c": 3}
    b = [1, 2, 3]
    print(a or b)  # {"a": 1, "b": 2, "c": 3}
    print(a and b)  # [1, 2, 3]
    print({} or [])  # []
    print({} and [])  # {}

    # or: first true one or last false one
    # and: first false one or last true one

    cond = a or b
    if cond == True:
        print("cond is true")
    elif cond:
        print("cond is truthy")
    else:
        print("cond is falsey")

# 9
def single_letter_variables():
    for i in range(100):  # OK
        ...

    for idx in range(100):  # easier to ctrl+f for idx
        ...

    _ = "unused OK"

    x, y, z = (1, 2, 3)  # OK

    a0, r, t = 1.0, .01, 1.0
    a = a0 * math.exp(r * t)

    # Please use names
    p = "data.txt"
    with open(p) as f:
        for l in f:
            s = l.split()
            t, u = s[0], s[-1]
            ti, ui = int(t), int(u)
            d = ui - ti
            ...

    # with open(p) as fp:
    #     for line in fp:
    #         tokens = line.split()
    #         first_token, last_token = tokens[0], tokens[-1]
    #         first_int, last_int = int(first_token), int(last_token)
    #         diff = last_int - first_int
    #         ...

# 10
def using_div_and_mod_instead_of_divmod(x, p):
    q, r = x // p, x % p
    q, r = divmod(x, p)
    if r == 0:
        print(f"{p} divides {x} evenly into {q} parts")
    else:
        print(f"{p} divides {x} into {q} parts with a remainder of {r}")

# 11
class JavaLike:
    def __init__(self, x):
        self._x = x

    def get_x(self):
        return self._x

    def set_x(self, x):
        # ...
        self._x = x

    @property
    def x(self):
        return self._x

    @x.setter
    def x(self, val):
        self._x = val


def not_knowing_about_properties():
    obj = JavaLike(0)

    obj.set_x(42)
    print(obj.get_x())

    obj.x = 42
    print(obj.x)

# 12
class Thingy:

    @property
    def val(self):
        # long computation
        ...
        return 42


def expensive_properties():
    thing = Thingy()

    val = thing.val  # if val is property, looks CHEAP

    val = thing.val()  # if val is function, looks maybe expensive


# 13
def inserting_or_deleting_while_iterating():
    # d = {chr(65+i): i for i in range(10)}
    # for key, val in d.items():
    #     if val % 2 == 0:
    #         del d[key]
    #         # d[key] = 42

    d = {chr(65 + i): i for i in range(10)}
    for key, val in list(d.items()):
        if val % 2 == 0:
            del d[key]
    print(d)

    d = {chr(65 + i): i for i in range(10)}
    to_delete = set()
    for key, val in d.items():
        if val % 2 == 0:
            to_delete.add(key)

    for key in to_delete:
        del d[key]
    print(d)


# 14
def using_filter_and_map_instead_of_comprehensions():
    xs = list(range(10))
    odds = filter(lambda x: x % 2 == 1, xs)
    squares = map(lambda x: x * x, xs)

    odds = (x for x in xs if x % 2 == 1)
    squares = (x * x for x in xs)

    def func(x):
        ...

    filtered = filter(func, xs)
    filtered = (x for x in xs if func(x))

    mapped = map(func, xs)
    mapped = (func(x) for x in xs)

    filtered = list(filter(func, xs))
    filtered = [x for x in xs if func(x)]

    mapped = list(map(func, xs))
    mapped = [func(x) for x in xs]


# 15
def defining_too_many_dunders():
    class Person:
        def __init__(self, name: str, friends: set):
            self.name = name
            self.friends = friends

        def __hash__(self):  # fine
            return hash(self.name)

        def __iadd__(self, other): # why?
            self.friends.add(other)
            other.friends.add(self)
            return self

        def add_friend(self, other):
            self.friends.add(other)
            other.friends.add(self)

    p1 = Person("James", set())
    p2 = Person("Other James", set())

    p1 += p2  # friends!
    p1.add_friend(p2)


# 16
def trying_to_parse_html_or_xml_using_regex():
    html = """
    <html>
    <body>
    <a href="https://mcoding.io">Great website</a>
    </body>
    </html>
    """

    links_regex = '<a href="(.*?)"'
    for match in re.finditer(links_regex, html):
        print(f"Found link: {match.group(1)}")

    class UrlParser(HTMLParser):
        def handle_starttag(self, tag: str, attrs):
            if tag != "a":
                return

            for attr, val in attrs:
                if attr == "href":
                    print(f"Found link: {val}")
                    break

    UrlParser().feed(html)
    # or use BeautifulSoup...


# 17
def not_knowing_about_raw_strings():
    some_path = "windows\\path\\to\\file.txt"
    some_path = r"c:\path\to\file.txt"

    some_regex = "\\d+\\.\\d*"
    some_regex = r"\d+\.\d*"

    val = 42
    interpolated = fr"\\ {val} //"
    print(interpolated)

    # gotcha = r"can't end in backslash \" # SyntaxError
    print(gotcha)

# 18
def thinking_super_means_parent():
    class Root:
        def f(self):
            print("Root.f")

    class A(Root):
        def f(self):
            print("A.f")
            super().f()

    class B(Root):
        def f(self):
            print("B.f")
            super().f()

    class C(A, B):
        def f(self):
            print("C.f")
            super().f()

    C().f()
    # C.f
    # A.f
    # B.f
    # Root.f

    print([cls.__name__ for cls in C.__mro__]) # C, A, B, Root, object

# 19
@dataclasses.dataclass
class Measurement:
    value: float
    timestamp: float
    location: tuple[float, float]
    error_estimate: tuple[float, float]


class Measurement(typing.NamedTuple):
    value: float
    timestamp: float
    location: tuple[float, float]
    error_estimate: tuple[float, float]


class Measurement(typing.TypedDict):
    value: float
    timestamp: float
    location: tuple[float, float]
    error_estimate: tuple[float, float]


def passing_structured_data_as_dict_or_tuple():
    # take some measurement
    measurement = 1.0001
    timestamp = ...
    location = ...
    error_estimate = ...

    data = {
        "measurement": measurement,
        "timestamp": timestamp,
        "location": location,
        "error_estimate": error_estimate,
    }

    data = (measurement, timestamp, location, error_estimate)

    return data

# 20
def using_namedtuple_instead_of_NamedTuple():
    Point = collections.namedtuple("Point", ["x", "y", "z"])
    p = Point(1, 2, 3)
    print(p.x + p.y + p.z)

    class Point(typing.NamedTuple):
        x: float
        y: float
        z: float

    p = Point(1, 2, 3)
    print(p.x + p.y + p.z)


# 21. import time side effects
```

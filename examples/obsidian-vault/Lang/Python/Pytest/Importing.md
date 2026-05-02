---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
- **prepend (default):** 
	- The directory path containing each module will be inserted into the beginning of sys.path if not already there, and then imported with the importlib.import_module function. It is highly recommended to arrange your test modules as packages by adding __init__.py files to your directories containing tests. This will make the tests part of a proper Python package, allowing pytest to resolve their full name (for example tests.core.test_core for test_core.py inside the tests.core package). If the test directory tree is not arranged as packages, then each test file needs to have a unique name compared to the other test files, otherwise pytest will raise an error if it finds two tests with the same name. This is the classic mechanism, dating back from the time Python 2 was still supported. 
- **append**: 
	- the directory containing each module is appended to the end of sys.path if not already there, and imported with importlib.import_module. This better allows users to run test modules against installed versions of a package even if the package under test
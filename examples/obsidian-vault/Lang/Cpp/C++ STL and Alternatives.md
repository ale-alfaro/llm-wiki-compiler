---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
Known alternatives:

- ETL (most known and popular)

- Philips version (need to explore)
  <https://github.com/philips-software/amp-embedded-infra-lib/tree/main>

- Pigweed (Google version) <https://cs.opensource.google/pigweed/pigweed>

  - Pretty big library, has a lot of tools (clang support for testing, static analysis,
    ASAN, etc)

  - Has Bazel as it’s main build system but supports Zephyr minimally.

  - Better to add source files in a per file basis instead of adding to the project

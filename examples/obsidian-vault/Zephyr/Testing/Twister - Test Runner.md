---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
The only test runner provided by Zephyr.
Works with west and also just as a standalone script in `scripts/`

## Concepts + Nomenclature

| Term | Definition |
| --- | --- |
| `Harness` | is a Python class inside Twister that allows us to capture and analyse output from a program external to Twister. It has been excised from this page for clarity, as it does not appear in final reports. |
| `TestCase` | , also called Case, is a piece of code that aims to verify some assertion. It is the smallest subdivision of testing in Zephyr. |
| `TestSuite` | also called Suite, is a grouping of Cases. One can modify Twister’s behaviour on a per-Suite basis via `testcase.yaml` files. Such grouped Cases should have enough in common for it to make sense to treat them all the same by Twister. |
| `TestInstance` | also called Instance, is a Suite on some platform. Twister typically reports its results for Instances, despite them being called “Suites” there. If a status is marked as applicable for Suites, it is also applicable for Instances. As the distinction between them is not useful in this section, whenever you read “Suite”, assume the same for Instances. |

## Architecture Diagram

![[screenshot 3.png]]

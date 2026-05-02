---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
[Generators Basics](https://youtube.com/watch?v=tmeKsb2Fras&si=Bd-rdIqffTOoAPT5)

```python
def example_composable():
	with open("nums.txt") as file:
		nums = (row.partition("#")[0].rstrip() for row in file)
		nums = (row for row in nums if row)
		nums = (float(row) for row in nums)
		nums = (x for x in nums if math. isfinite (x))
		nums = (max(0., X) for x in nums)
		s = sum(nums)
		# print(f"the sum is {s}")
```
## Async Generators

### Watch Out for Clean up!

[Async Generator cleanup](https://youtu.be/N56Jrqc7SBk?si=k49h7IYpfvxL0Tjj)

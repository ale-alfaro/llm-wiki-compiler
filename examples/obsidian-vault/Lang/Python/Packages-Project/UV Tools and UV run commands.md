---
id: uv tools
aliases:
tags:
  - uv
  - python
  - pyproject
  - app
  - advanced
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Core concepts

- Use `uv tool run` or its alias `uvx`for **isolation**.
- Use `uv run` for testing/using the **development environment of a project**
- Installing with `uv tool install` uses the same interface as uvx and has the same isolation benefits. Installing adds the executable to a dir in `PATH` and has a pinned version and dependencies associated with it. 
- `uv tool install` creates a `venv` for the tool in the `uv tool dir` that needs to be explicitly removed, or modified. `uvx` creates a disposable `venv` that will be removed when running `uv cache clean`
- When to install vs just run? From the [docs](https://docs.astral.sh/uv/concepts/tools/#the-uv-tool-interface):
> In most cases, executing a tool with `uvx` is more appropriate than installing the tool. Installing the tool is useful if you need the tool to be available to other programs on your system, e.g., if some script you do not control requires the tool, or if you are in a Docker image and want to make the tool available to users.


# Core Commands

Run a tool without installing:
	•	Command: `uvx <tool-name>`
	•	Creates a temporary virtual environment.
	•	Use `uvx <tool-name>@<version>` to specify a version.
	•	Use `uvx <tool-name>@latest` to force the latest version.

Install a tool:
	•	Command: `uv tool install <tool-name>`
	•	Makes the tool available on the PATH.
	•	Use `uv tool install <tool-name>@<version>` to specify a version.
	•	Use `uv tool install <tool-name>@latest` for the latest version.

Upgrade a tool:
	•	Command: `uv tool upgrade <tool-name>`
	•	Respects version constraints set during installation.
	•	Use `—reinstall` to reinstall all packages.
	•	Use `—reinstall-package <package>` to reinstall a specific package.

Include additional dependencies:
	•	During execution: `uvx —with <extra-package> <tool>`
	•	During installation: `uv tool install —with <extra-package> <tool-package>`
	•	Use `—with-executables-from` to include executables from additional packages.

Specify Python version:
	•	Command: `uv tool install —python <version> <tool-name>`
	•	Ignores non-global Python version requests.

Manage tool environments:
	•	Temporary environments are stored in the uv cache directory.
	•	Installed environments are stored in the uv tools directory.
	•	Warning: Do not mutate tool environments manually.

PATH and executables:
	•	Executable directory must be in the PATH.
	•	Use `uv tool update-shell` to add the executable directory to the PATH.
	•	Warning: Installation will not overwrite executables not installed by uv. Use `—force` to override.

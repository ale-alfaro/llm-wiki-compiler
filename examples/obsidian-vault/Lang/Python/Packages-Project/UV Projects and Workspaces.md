---
id: UV Projects and Workspaces
aliases: []
tags:
  - uv
  - pyproject
  - python
  - basics
  - top
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Projects

**Definition:**

1. Has `pyproject.toml` that is the standardized version with additional metadata for `uv`
2. Has `uv.lock` that keeps the resolved dependencies of the project
3. Has .venv created and managed by `uv` and that is synced with the `uv.lock`

# Workspaces

It is a collection of projects as defined above except for:

1. Has top-level `pyproject.toml` that has two additional entries:

```toml

bird-feeder = { workspace = true }

[tool.uv.workspace]
members = ["packages/*"]
exclude = ["packages/seeds"]
```

1. Has `uv.lock` that keeps the resolved dependencies of the project
2. Has .venv created and managed by `uv` and that is synced with the `uv.lock`

# Dependencies

Important terms to distinguish and define for uv _locking_ vs _syncing_:

> Locking is the process of resolving your project's dependencies into a [lockfile](https://docs.astral.sh/uv/concepts/projects/layout/#the-lockfile). Syncing is the process of installing a subset of packages from the lockfile into the [project environment](https://docs.astral.sh/uv/concepts/projects/layout/#the-project-environment).

**Locking -> Syncing**

## Locking and sync with UV

```sh
uv sync
```

This will:

- Create a venv if none exists
- Download Python version or use one cached or in the venv that matches the lockfile Python version
- Install/uninstall dependencies
  And there is also:

```sh
uv run
```

Which does `uv sync` automatically before every run so this doesn’t need to be invoked when using it. Furthermore `uv run` does more and also:

- creates a `uv.lock` file and resolves the dependencies to specific versions
- activates the `.venv` with those dependency versions installed

## Disabling syncing or locking

No locking:

```sh
uv run --locked ...
```

The above will raise an error if the lockfile is out-of-date. A bigger hammer that does the same but doesn’t check for up to date lockfile is:

```sh
uv run --frozen ...
```

No syncing:

```sh
uv run --no-sync ...
```

## Updating Dependency Versions

```sh
uv lock —-upgrade
```

# Running Commands or Scripts

## Running without venv (Isolated from project)

You want to use `uv tool` for this or its shorter alias `uvx`

```sh
uv run --with debugpy \
  -m debugpy \
  --listen 127.0.0.1:5678 |
  --wait-for-client \
    -m pytest
```

Polish guy guide on UV workspaces:

- Video on uv and python projects -[Part
  2](https://youtu.be/TiBIjouDGuI?si=RZ5L22uR2RrHCYd5)

- Article on topic with docker - [link](https://hynek.me/articles/docker-uv/)

Look at Arjancodes as well and [[Basics]]

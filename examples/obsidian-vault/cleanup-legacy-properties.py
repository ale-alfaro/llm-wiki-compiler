#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Remove legacy properties that have been migrated to standard ones.

Removes: last, last modified, clipped, published, linter-yaml-title-alias

Usage:
    uv run scripts/cleanup-legacy-properties.py              # dry-run
    uv run scripts/cleanup-legacy-properties.py --execute     # apply
"""

import re
import sys
from pathlib import Path

VAULT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"templates", "scripts", "_categories", "attachments", ".obsidian"}

# Properties to remove (all lowercase keys as they appear in frontmatter)
REMOVE = {"last", "last modified", "clipped", "published", "linter-yaml-title-alias"}

execute = "--execute" in sys.argv

FM_RE = re.compile(r"^---\n(.*?\n)---\n", re.DOTALL)


def process_file(path: Path, rel: Path) -> list[str]:
    """Return list of removed property names, or empty if nothing to do."""
    text = path.read_text(encoding="utf-8", errors="replace")
    m = FM_RE.match(text)
    if not m:
        return []

    raw_fm = m.group(1)
    body = text[m.end() :]

    # Parse into (key, full_block) pairs preserving order and continuation lines
    entries: list[tuple[str, str]] = []
    current_key: str | None = None
    current_lines: list[str] = []

    for line in raw_fm.splitlines():
        if line and line[0] in (" ", "\t"):
            # continuation
            current_lines.append(line)
            continue

        # flush
        if current_key is not None:
            entries.append((current_key, "\n".join(current_lines)))

        if ":" in line:
            key, _, val = line.partition(":")
            current_key = key.strip()
            current_lines = [f"{current_key}:{val}"]
        else:
            current_key = None
            current_lines = []

    if current_key is not None:
        entries.append((current_key, "\n".join(current_lines)))

    # Find which keys to remove
    removed = [key for key, _ in entries if key in REMOVE]
    if not removed:
        return []

    if execute:
        kept = [block for key, block in entries if key not in REMOVE]
        new_fm = "\n".join(kept) + "\n" if kept else ""
        new_text = f"---\n{new_fm}---\n{body}"
        path.write_text(new_text, encoding="utf-8")

    return removed


# ── main ─────────────────────────────────────────────────────────────────────

md_files = sorted(
    p
    for p in VAULT.rglob("*.md")
    if not any(part in SKIP_DIRS for part in p.relative_to(VAULT).parts)
)

total = len(md_files)
changed = 0
total_removed = 0
removed_counts: dict[str, int] = {k: 0 for k in REMOVE}

print(f"=== Legacy Property Cleanup ===")
print(f"MODE: {'EXECUTE' if execute else 'DRY-RUN'}")
print(f"Removing: {', '.join(sorted(REMOVE))}")
print(f"Files to scan: {total}\n")

for i, path in enumerate(md_files):
    rel = path.relative_to(VAULT)
    removed = process_file(path, rel)
    if removed:
        changed += 1
        total_removed += len(removed)
        for k in removed:
            removed_counts[k] += 1
        print(f"[{i + 1}/{total}] {rel}")
        for k in removed:
            print(f"  - {k}")

print(f"\n=== Summary ===")
print(f"Files scanned:  {total}")
print(f"Files changed:  {changed}")
print(f"Properties removed: {total_removed}")
for k, v in sorted(removed_counts.items()):
    if v:
        print(f"  {k}: {v}")
if not execute:
    print(f"\nThis was a DRY RUN. Add --execute to apply.")

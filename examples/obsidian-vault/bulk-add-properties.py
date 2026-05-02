#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Add missing standard properties to all vault notes by editing files directly.

Fast — no Obsidian CLI calls. Reads each file, patches the YAML frontmatter
in-memory, writes it back only if something changed.

Usage:
    uv run scripts/bulk-add-properties.py              # dry-run
    uv run scripts/bulk-add-properties.py --execute     # apply changes
"""

import re
import sys
from datetime import datetime
from pathlib import Path

VAULT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"templates", "scripts", "_categories", "attachments", ".obsidian"}

execute = "--execute" in sys.argv

# ── helpers ──────────────────────────────────────────────────────────────────

FM_RE = re.compile(r"^---\n(.*?\n)---\n", re.DOTALL)
DATE_RE = re.compile(r"\d{4}-\d{2}-\d{2}")


def parse_frontmatter(text: str) -> tuple[dict[str, str], str, str]:
    """Return (props dict, raw frontmatter block, body after frontmatter).

    props values are kept as raw YAML strings (not parsed).
    """
    m = FM_RE.match(text)
    if not m:
        return {}, "", text

    raw_fm = m.group(1)
    body = text[m.end() :]

    props: dict[str, str] = {}
    current_key = None
    current_val_lines: list[str] = []

    for line in raw_fm.splitlines():
        # continuation line (starts with whitespace or is "  - ...")
        if line and (line[0] in (" ", "\t")):
            if current_key:
                current_val_lines.append(line)
            continue

        # flush previous key
        if current_key is not None:
            props[current_key] = "\n".join(current_val_lines)

        # new key: value
        if ":" in line:
            key, _, val = line.partition(":")
            current_key = key.strip()
            current_val_lines = [val]
        else:
            current_key = None
            current_val_lines = []

    if current_key is not None:
        props[current_key] = "\n".join(current_val_lines)

    return props, raw_fm, body


def extract_date(raw: str) -> str:
    """Pull YYYY-MM-DD from a raw YAML value string."""
    m = DATE_RE.search(raw)
    return m.group(0) if m else ""


def file_dates(path: Path) -> tuple[str, str]:
    """Return (created, modified) as YYYY-MM-DD from file stat."""
    st = path.stat()
    ctime = datetime.fromtimestamp(min(st.st_ctime, st.st_mtime))
    mtime = datetime.fromtimestamp(st.st_mtime)
    return ctime.strftime("%Y-%m-%d"), mtime.strftime("%Y-%m-%d")


def build_new_frontmatter(props: dict[str, str], adds: dict[str, str]) -> str:
    """Reconstruct the frontmatter YAML with new properties appended."""
    lines: list[str] = []

    for key, val in props.items():
        all_lines = (
            [val] if isinstance(val, str) and "\n" not in val else val.split("\n")
        )
        first = all_lines[0]
        lines.append(f"{key}:{first}")
        for continuation in all_lines[1:]:
            lines.append(continuation)

    for key, val in adds.items():
        lines.append(f"{key}: {val}")

    return "\n".join(lines) + "\n"


# ── main ─────────────────────────────────────────────────────────────────────

md_files = sorted(
    p
    for p in VAULT.rglob("*.md")
    if not any(part in SKIP_DIRS for part in p.relative_to(VAULT).parts)
)

total = len(md_files)
changed = 0
skipped = 0
no_fm_created = 0

print(f"=== Bulk Property Update ===")
print(f"MODE: {'EXECUTE' if execute else 'DRY-RUN'}")
print(f"Files to scan: {total}\n")

for i, path in enumerate(md_files):
    rel = path.relative_to(VAULT)
    text = path.read_text(encoding="utf-8", errors="replace")

    props, raw_fm, body = parse_frontmatter(text)
    has_fm = bool(raw_fm)

    adds: dict[str, str] = {}

    if "note_type" not in props:
        adds["note_type"] = rel.parts[0]

    if "categories" not in props:
        adds["categories"] = "[]"

    if "created" not in props:
        created_val = ""
        for alt in ("clipped", "published", "date"):
            if alt in props:
                created_val = extract_date(props[alt])
                if created_val:
                    break
        if not created_val:
            created_val, _ = file_dates(path)
        adds["created"] = created_val

    if "modified" not in props:
        mod_val = ""
        for alt in ("last", "last modified"):
            if alt in props:
                mod_val = extract_date(props[alt])
                if mod_val:
                    break
        if not mod_val:
            _, mod_val = file_dates(path)
        adds["modified"] = mod_val

    if "tags" not in props:
        adds["tags"] = "[]"

    if not adds:
        skipped += 1
        continue

    print(f"[{i + 1}/{total}] {rel}")
    for k, v in adds.items():
        print(f"  + {k}: {v}")

    if execute:
        if has_fm:
            new_fm = build_new_frontmatter(props, adds)
            new_text = f"---\n{new_fm}---\n{body}"
        else:
            fm_lines = [f"{k}: {v}" for k, v in adds.items()]
            new_text = "---\n" + "\n".join(fm_lines) + "\n---\n" + text
            no_fm_created += 1

        path.write_text(new_text, encoding="utf-8")

    changed += 1

print(f"\n=== Summary ===")
print(f"Files scanned:  {total}")
print(f"Files changed:  {changed}")
print(f"Files skipped:  {skipped} (already complete)")
if no_fm_created:
    print(f"Frontmatter created from scratch: {no_fm_created}")
if not execute:
    print(f"\nThis was a DRY RUN. Add --execute to apply.")

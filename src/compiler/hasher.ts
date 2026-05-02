/**
 * Source file hashing and vault walking for change detection.
 *
 * Computes SHA-256 hashes of source files and compares them against
 * previously stored state to determine which files need recompilation.
 * This enables incremental compilation — only changed or new sources
 * are sent through the LLM pipeline.
 *
 * Walks the vault recursively so deeply-nested Obsidian-style folder
 * structures work without flattening. Attachment directories (`res/`)
 * and non-markdown files are skipped.
 */

import { createHash } from "node:crypto";
import type { Dirent } from "node:fs";
import { readFile, readdir } from "fs/promises";
import path from "path";
import type { CompilePaths, WikiState, SourceChange } from "../utils/types.js";

/** Folder names anywhere in the vault tree that hold attachments, not notes. */
const ATTACHMENT_DIRS: ReadonlySet<string> = new Set(["res"]);

/**
 * Read a file and compute its SHA-256 hash.
 * @param filePath - Absolute path to the file to hash.
 * @returns Hex-encoded SHA-256 digest of the file contents.
 */
export async function hashFile(filePath: string): Promise<string> {
  const content = await readFile(filePath, "utf-8");
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Scan the vault directory and compare file hashes against previous state
 * to identify new, changed, unchanged, and deleted source files.
 *
 * Source identifiers are vault-relative POSIX-style paths (e.g.
 * `Zephyr/Kernel/Kernel.md`) so deep folders with colliding basenames
 * stay distinguishable in `state.json` and citations.
 *
 * @param paths - Resolved compile paths (vault + include filter).
 * @param prevState - The previously persisted WikiState to compare against.
 */
export async function detectChanges(
  paths: CompilePaths,
  prevState: WikiState,
): Promise<SourceChange[]> {
  const currentFiles = await listVaultMarkdown(paths.vault, paths.include);
  const changes: SourceChange[] = [];

  for (const file of currentFiles) {
    const status = await classifyFile(paths.vault, file, prevState);
    changes.push({ file, status });
  }

  changes.push(...findDeletedFiles(currentFiles, prevState));
  return changes;
}

/**
 * List every markdown file under the vault, returning POSIX-style paths
 * relative to the vault root. Skips attachment subdirectories and any
 * files that don't match the optional include glob.
 */
async function listVaultMarkdown(
  vaultDir: string,
  include?: string,
): Promise<string[]> {
  let entries: Dirent[];
  try {
    entries = await readdir(vaultDir, { withFileTypes: true, recursive: true });
  } catch {
    return [];
  }

  const results: string[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

    const absPath = path.join(entry.parentPath ?? vaultDir, entry.name);
    const relPath = toPosix(path.relative(vaultDir, absPath));
    if (isInsideAttachmentDir(relPath)) continue;
    if (!matchesInclude(relPath, include)) continue;
    results.push(relPath);
  }
  return results.sort();
}

/** True when any segment of the relative path is a known attachment folder. */
function isInsideAttachmentDir(relPath: string): boolean {
  return relPath.split("/").some((segment) => ATTACHMENT_DIRS.has(segment));
}

/** Apply the include glob if provided; otherwise keep the path. */
function matchesInclude(relPath: string, include: string | undefined): boolean {
  if (!include) return true;
  return path.matchesGlob(relPath, include);
}

/**
 * Convert a platform-native relative path to a POSIX-style path so vault
 * identifiers stay stable across operating systems.
 */
function toPosix(relPath: string): string {
  if (path.sep === "/") return relPath;
  return relPath.split(path.sep).join("/");
}

/** Classify a single source file as new, changed, or unchanged. */
async function classifyFile(
  vaultDir: string,
  file: string,
  prevState: WikiState,
): Promise<SourceChange["status"]> {
  const filePath = path.join(vaultDir, file);
  const hash = await hashFile(filePath);
  const prev = prevState.sources[file];

  if (!prev) return "new";
  if (prev.hash !== hash) return "changed";
  return "unchanged";
}

/** Find source files present in previous state but missing from disk. */
function findDeletedFiles(
  currentFiles: string[],
  prevState: WikiState,
): SourceChange[] {
  const currentSet = new Set(currentFiles);
  return Object.keys(prevState.sources)
    .filter((file) => !currentSet.has(file))
    .map((file) => ({ file, status: "deleted" as const }));
}

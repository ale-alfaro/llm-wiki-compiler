/**
 * Resolve the absolute on-disk paths the compile pipeline reads and writes.
 *
 * Given a project root and a CompileOptions snapshot, returns a CompilePaths
 * object the rest of the pipeline can use without re-deriving paths from
 * constants. Defaults preserve the legacy layout (`<root>/sources` →
 * `<root>/wiki`) so existing projects keep working when no overrides are set.
 */

import path from "node:path";
import type { CompileOptions, CompilePaths } from "./types.js";

/** Default vault subdirectory when `options.vault` is unset. */
const DEFAULT_VAULT_SUBDIR = "sources";

/** Default output subdirectory when `options.output` is unset. */
const DEFAULT_OUTPUT_SUBDIR = "wiki";

/**
 * Build a CompilePaths from `root` plus optional vault/output overrides.
 *
 * Override values may be absolute or relative; relative paths are resolved
 * against `root`. Trailing slashes are normalised away by `path.resolve`.
 *
 * @param root - Project root directory (typically `process.cwd()`).
 * @param options - Vault, output, and include overrides from CLI/env.
 */
export function resolveCompilePaths(
  root: string,
  options: Pick<CompileOptions, "vault" | "output" | "include"> = {},
): CompilePaths {
  const vault = resolveAgainstRoot(root, options.vault, DEFAULT_VAULT_SUBDIR);
  const output = resolveAgainstRoot(root, options.output, DEFAULT_OUTPUT_SUBDIR);

  return {
    root: path.resolve(root),
    vault,
    output,
    conceptsDir: path.join(output, "concepts"),
    indexFile: path.join(output, "index.md"),
    mocFile: path.join(output, "MOC.md"),
    include: options.include?.trim() || undefined,
  };
}

/** Resolve a configured path or fall back to a subdirectory of `root`. */
function resolveAgainstRoot(
  root: string,
  configured: string | undefined,
  defaultSubdir: string,
): string {
  if (configured && configured.trim().length > 0) {
    return path.resolve(root, configured);
  }
  return path.resolve(root, defaultSubdir);
}

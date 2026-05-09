/**
 * Shared test helper for generating and reading a wiki index.
 */

import { readFile } from "fs/promises";
import path from "path";
import { generateIndex } from "../../src/compiler/indexgen.js";
import { resolveCompilePaths } from "../../src/utils/paths.js";

/**
 * Generate the wiki index for a project root and return its content.
 * @param root - Absolute path to the wiki project root.
 * @returns The full text content of the generated index.md.
 */
export async function generateAndReadIndex(root: string): Promise<string> {
  const paths = resolveCompilePaths(root);
  await generateIndex(paths);
  return readFile(path.join(root, "wiki/index.md"), "utf-8");
}

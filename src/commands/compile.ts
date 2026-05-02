/**
 * Commander action for `llmwiki compile`.
 * Checks that the configured vault directory exists, then delegates to the
 * compilation orchestrator to process all new and changed source files into
 * wiki pages.
 */

import { existsSync } from "fs";
import { compile } from "../compiler/index.js";
import { resolveCompilePaths } from "../utils/paths.js";
import * as output from "../utils/output.js";
import type { CompileOptions } from "../utils/types.js";

/**
 * Run the compile command from the current working directory.
 * Exits early if no vault directory exists yet.
 * @param options - Optional behaviour overrides forwarded from the CLI flag set.
 */
export default async function compileCommand(options: CompileOptions = {}): Promise<void> {
  const root = process.cwd();
  const paths = resolveCompilePaths(root, options);

  if (!existsSync(paths.vault)) {
    output.status(
      "!",
      output.warn(`No vault found at ${paths.vault}. Pass --vault <dir> or create the directory.`),
    );
    return;
  }

  await compile(root, options);
}

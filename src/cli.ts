/**
 * CLI entry point for llmwiki — the compile-only foundation.
 *
 * Registers compile and review subcommands via Commander and validates
 * the active LLM provider's credentials before any LLM-backed action runs.
 */

import "dotenv/config";
import { createRequire } from "module";
import { Command } from "commander";
import compileCommand from "./commands/compile.js";
import reviewListCommand from "./commands/review-list.js";
import reviewShowCommand from "./commands/review-show.js";
import reviewApproveCommand from "./commands/review-approve.js";
import reviewRejectCommand from "./commands/review-reject.js";
import { DEFAULT_PROVIDER } from "./utils/constants.js";
import { resolveAnthropicAuthFromEnv } from "./utils/claude-settings.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const program = new Command();

program
  .name("llmwiki")
  .description("Compile raw sources into an interlinked markdown wiki")
  .version(version);

program
  .command("compile")
  .description("Compile sources/ into an interlinked wiki")
  .option(
    "--review",
    "Write generated pages as review candidates under .llmwiki/candidates/ instead of mutating wiki/. Orphan-marking for deleted sources is deferred until the next non-review compile.",
  )
  .option(
    "--lang <code>",
    "Target language for generated wiki content (e.g. \"Chinese\", \"ja\", \"zh-CN\"). Equivalent to setting LLMWIKI_OUTPUT_LANG.",
  )
  .action(async (options: { review?: boolean; lang?: string }) => {
    try {
      applyLanguageOption(options.lang);
      requireProvider();
      await compileCommand({ review: options.review });
    } catch (err) {
      console.error(`\x1b[31mError:\x1b[0m ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  });

const reviewCommand = program
  .command("review")
  .description("Inspect and act on pending compile review candidates");

reviewCommand
  .command("list")
  .description("List pending review candidates")
  .action(async () => {
    try {
      await reviewListCommand();
    } catch (err) {
      console.error(`\x1b[31mError:\x1b[0m ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  });

reviewCommand
  .command("show <id>")
  .description("Print a single candidate's metadata and body")
  .action(async (id: string) => {
    try {
      await reviewShowCommand(id);
    } catch (err) {
      console.error(`\x1b[31mError:\x1b[0m ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  });

reviewCommand
  .command("approve <id>")
  .description("Approve a candidate and promote it into wiki/concepts/")
  .action(async (id: string) => {
    try {
      await reviewApproveCommand(id);
    } catch (err) {
      console.error(`\x1b[31mError:\x1b[0m ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  });

reviewCommand
  .command("reject <id>")
  .description("Reject a candidate and archive it without touching wiki/")
  .action(async (id: string) => {
    try {
      await reviewRejectCommand(id);
    } catch (err) {
      console.error(`\x1b[31mError:\x1b[0m ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  });

/**
 * Apply the --lang CLI option by setting LLMWIKI_OUTPUT_LANG so prompt
 * builders pick it up. Single env slot keeps the resolution order simple:
 * explicit flag wins over the inherited environment.
 */
function applyLanguageOption(lang: string | undefined): void {
  if (lang && lang.trim().length > 0) {
    process.env.LLMWIKI_OUTPUT_LANG = lang.trim();
  }
}

/** API key env var required per provider. Null means no key needed. */
const PROVIDER_KEY_VARS: Record<string, string | null> = {
  anthropic: "ANTHROPIC_API_KEY",
  ollama: null,
};

/** Exit with a helpful message if the selected provider's API key is missing. */
function requireProvider(): void {
  const provider = process.env.LLMWIKI_PROVIDER ?? DEFAULT_PROVIDER;

  if (provider === "anthropic") {
    const auth = resolveAnthropicAuthFromEnv();
    if (!auth.apiKey && !auth.authToken) {
      console.error(
        `\x1b[31mError:\x1b[0m Anthropic credentials are required for the "anthropic" provider.\n` +
          `  Set one of: export ANTHROPIC_API_KEY=<your-key> OR export ANTHROPIC_AUTH_TOKEN=<your-token>`,
      );
      process.exit(1);
    }
    return;
  }

  const keyVar = PROVIDER_KEY_VARS[provider];

  if (keyVar === undefined) {
    console.error(
      `\x1b[31mError:\x1b[0m Unknown provider "${provider}".\n` +
        `  Supported: ${Object.keys(PROVIDER_KEY_VARS).join(", ")}`,
    );
    process.exit(1);
  }

  if (keyVar && !process.env[keyVar]) {
    console.error(
      `\x1b[31mError:\x1b[0m ${keyVar} environment variable is required for the "${provider}" provider.\n` +
        `  Set it with: export ${keyVar}=<your-key>`,
    );
    process.exit(1);
  }
}

program.parse();

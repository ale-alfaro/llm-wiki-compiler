/**
 * Seed-page materialisation for the compile pipeline.
 *
 * Schema-declared seed pages (overview, comparison, entity) are written under
 * the configured concepts directory next to concept pages so existing tooling
 * (index, MOC) treats them uniformly. Seed generation is a deterministic
 * write — re-running it is safe and idempotent within a single compile pass.
 */

import path from "node:path";
import {
  atomicWrite,
  buildFrontmatter,
  parseFrontmatter,
  safeReadFile,
  slugify,
  validateWikiPage,
} from "../utils/markdown.js";
import { callClaude } from "../utils/llm.js";
import { buildSeedPagePrompt } from "./prompts.js";
import { addObsidianMeta } from "./obsidian.js";
import * as output from "../utils/output.js";
import type { SchemaConfig, SeedPage } from "../schema/index.js";
import type { CompilePaths, WikiFrontmatter } from "../utils/types.js";

/**
 * Materialise schema-declared seed pages.
 *
 * @param paths - Resolved compile paths providing the concepts directory.
 * @param schema - Resolved schema config containing seedPages and kind rules.
 * @param errorBucket - Mutable container that collects validation errors.
 */
export async function generateSeedPages(
  paths: CompilePaths,
  schema: SchemaConfig,
  errorBucket: { errors: string[] },
): Promise<void> {
  if (schema.seedPages.length === 0) return;
  for (const seed of schema.seedPages) {
    const error = await generateSingleSeedPage(paths, schema, seed);
    if (error) errorBucket.errors.push(error);
  }
}

/** Build, prompt, and persist a single seed page. */
async function generateSingleSeedPage(
  paths: CompilePaths,
  schema: SchemaConfig,
  seed: SeedPage,
): Promise<string | null> {
  const slug = slugify(seed.title);
  const pagePath = path.join(paths.conceptsDir, `${slug}.md`);
  const relatedContent = await loadSeedRelatedPages(paths.conceptsDir, seed.relatedSlugs ?? []);
  const rule = schema.kinds[seed.kind];
  const system = buildSeedPagePrompt(seed, rule, relatedContent);
  const pageBody = await callClaude({
    system,
    messages: [{ role: "user", content: `Write the ${seed.kind} page titled "${seed.title}".` }],
  });

  const now = new Date().toISOString();
  const existing = await safeReadFile(pagePath);
  const existingMeta = existing ? parseFrontmatter(existing).meta : null;
  const createdAt = typeof existingMeta?.createdAt === "string" ? existingMeta.createdAt : now;
  const typedFields: WikiFrontmatter = {
    title: seed.title,
    summary: seed.summary,
    sources: [],
    kind: seed.kind,
    createdAt,
    updatedAt: now,
  };
  const frontmatterFields: Record<string, unknown> = { ...typedFields };
  addObsidianMeta(frontmatterFields, seed.title, []);
  const frontmatter = buildFrontmatter(frontmatterFields);
  return await writeSeedPageIfValid(pagePath, `${frontmatter}\n\n${pageBody}\n`, seed.title);
}

/** Load the bodies of the related concept pages a seed page should weave together. */
async function loadSeedRelatedPages(conceptsDir: string, slugs: string[]): Promise<string> {
  if (slugs.length === 0) return "";
  const contents: string[] = [];
  for (const slug of slugs) {
    const pagePath = path.join(conceptsDir, `${slug}.md`);
    const content = await safeReadFile(pagePath);
    if (content) contents.push(content);
  }
  return contents.join("\n\n---\n\n");
}

/** Validate and atomically write a seed page, logging the result. */
async function writeSeedPageIfValid(
  pagePath: string,
  content: string,
  title: string,
): Promise<string | null> {
  if (!validateWikiPage(content)) {
    output.status("!", output.warn(`Invalid seed page for "${title}" — skipped.`));
    return `Invalid page for "${title}" — failed validation`;
  }

  await atomicWrite(pagePath, content);
  return null;
}

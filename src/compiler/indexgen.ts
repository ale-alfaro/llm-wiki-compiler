/**
 * Wiki index generator.
 *
 * Scans all concept pages in wiki/concepts/, extracts frontmatter metadata,
 * and produces wiki/index.md with a sorted list of all concepts and their
 * summaries. Used after each compilation pass.
 */

import { readdir } from "fs/promises";
import path from "path";
import { atomicWrite, safeReadFile, parseFrontmatter } from "../utils/markdown.js";
import { CONCEPTS_DIR, INDEX_FILE } from "../utils/constants.js";
import * as output from "../utils/output.js";
import type { PageSummary } from "../utils/types.js";

/**
 * Generate the wiki/index.md listing all concept pages with summaries.
 * @param root - Project root directory.
 */
export async function generateIndex(root: string): Promise<void> {
  output.status("*", output.info("Generating index..."));

  const conceptsPath = path.join(root, CONCEPTS_DIR);
  const concepts = await collectPageSummaries(conceptsPath);
  concepts.sort((a, b) => a.title.localeCompare(b.title));

  const indexContent = buildIndexContent(concepts);
  const indexPath = path.join(root, INDEX_FILE);
  await atomicWrite(indexPath, indexContent);

  output.status("+", output.success(`Index updated with ${concepts.length} pages.`));
}

/** A scanned page paired with its parsed frontmatter. */
interface ScannedPage {
  slug: string;
  meta: Record<string, unknown>;
}

/**
 * Scan a wiki directory and return every .md page paired with its parsed
 * frontmatter. Returns an empty array when the directory is missing.
 * @param dirPath - Absolute path to a wiki page directory.
 */
async function scanWikiPages(dirPath: string): Promise<ScannedPage[]> {
  let files: string[];
  try {
    files = await readdir(dirPath);
  } catch {
    return [];
  }

  const scanned: ScannedPage[] = [];
  for (const file of files.filter((f) => f.endsWith(".md"))) {
    const content = await safeReadFile(path.join(dirPath, file));
    const { meta } = parseFrontmatter(content);
    scanned.push({ slug: file.replace(/\.md$/, ""), meta });
  }
  return scanned;
}

/**
 * Project a wiki directory into PageSummary entries (excludes orphaned and
 * untitled pages).
 * @param conceptsPath - Absolute path to wiki/concepts/.
 */
async function collectPageSummaries(
  conceptsPath: string,
): Promise<PageSummary[]> {
  const scanned = await scanWikiPages(conceptsPath);
  return scanned
    .filter(({ meta }) => meta.title && typeof meta.title === "string" && !meta.orphaned)
    .map(({ slug, meta }) => ({
      title: meta.title as string,
      slug,
      summary: typeof meta.summary === "string" ? meta.summary : "",
    }));
}

/** Strip [[wikilink]] brackets from text, leaving the inner text intact. */
function stripWikilinks(text: string): string {
  return text.replace(/\[\[([^\]]+)\]\]/g, "$1");
}

/**
 * Build the index.md markdown content from page summaries.
 * @param concepts - Sorted array of concept page summaries.
 */
function buildIndexContent(concepts: PageSummary[]): string {
  const lines = ["# Knowledge Wiki", "", "## Concepts", ""];

  for (const page of concepts) {
    lines.push(`- **[[${page.slug}|${page.title}]]** — ${stripWikilinks(page.summary)}`);
  }

  lines.push("");
  lines.push(`_${concepts.length} pages | Generated ${new Date().toISOString()}_`);
  lines.push("");

  return lines.join("\n");
}

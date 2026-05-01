/**
 * In-memory lint rules used by the compile review pipeline.
 *
 * The full lint command was removed when the project was trimmed to a
 * compile-only foundation. The compile pipeline still needs a small subset
 * of those rules to attach diagnostics to review candidates before a
 * reviewer approves the page:
 *
 * - {@link checkPageMalformedCitations} — `^[file.md:abc]` style typos
 * - {@link checkPageBrokenCitations}    — citations that reference missing
 *   source files or out-of-range line spans
 * - {@link checkPageCrossLinks}         — schema-declared minimum
 *   `[[wikilink]]` count for the page's `kind`
 *
 * Each rule operates on a single page's content already in memory so it can
 * run without touching the file system more than necessary.
 */

import { existsSync } from "fs";
import path from "path";
import {
  isMalformedCitationEntry,
  parseFrontmatter,
  safeReadFile,
} from "../utils/markdown.js";
import type { LintResult } from "./types.js";
import {
  countWikilinks,
  resolvePageKind,
  type SchemaConfig,
} from "../schema/index.js";

/** Pattern matching ^[filename.md] citation markers in markdown content. */
const CITATION_PATTERN = /\^\[([^\]]+)\]/g;

/** Match result with its line number and captured group. */
interface LineMatch {
  captured: string;
  line: number;
}

/** Scan all lines of a page's content and return regex matches with line numbers. */
function findMatchesInContent(content: string, pattern: RegExp): LineMatch[] {
  const results: LineMatch[] = [];
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const matches = lines[i].matchAll(pattern);
    for (const match of matches) {
      results.push({ captured: match[1], line: i + 1 });
    }
  }
  return results;
}

/** Strip an optional `:start-end` or `#Lstart-Lend` span suffix from a citation entry. */
function stripSpanSuffix(entry: string): string {
  const colonIdx = entry.indexOf(":");
  const hashIdx = entry.indexOf("#");
  const cuts = [colonIdx, hashIdx].filter((i) => i >= 0);
  if (cuts.length === 0) return entry;
  return entry.slice(0, Math.min(...cuts));
}

/** Regex matching the `:start-end` span suffix on a citation entry. */
const COLON_SPAN_PATTERN = /^[^:#]+:(\d+)(?:-(\d+))?$/;

/** Regex matching the `#Lstart-Lend` span suffix on a citation entry. */
const HASH_SPAN_PATTERN = /^[^:#]+#L(\d+)(?:-L(\d+))?$/;

/** Parsed line range from a citation entry, or null if no range is present. */
interface ParsedLineRange {
  start: number;
  end: number;
}

/** Extract the line range from a citation entry string, or return null if there is none. */
function parseLineRange(entry: string): ParsedLineRange | null {
  const colonMatch = COLON_SPAN_PATTERN.exec(entry);
  if (colonMatch) {
    const start = Number(colonMatch[1]);
    const end = colonMatch[2] !== undefined ? Number(colonMatch[2]) : start;
    return { start, end };
  }
  const hashMatch = HASH_SPAN_PATTERN.exec(entry);
  if (hashMatch) {
    const start = Number(hashMatch[1]);
    const end = hashMatch[2] !== undefined ? Number(hashMatch[2]) : start;
    return { start, end };
  }
  return null;
}

/** Count the number of lines in a file's text content. */
function countLines(content: string): number {
  if (content.length === 0) return 0;
  return content.split("\n").length;
}

/**
 * Check cross-link minimums for a single page given as a raw content string.
 *
 * The `filePath` parameter is embedded verbatim in each `LintResult.file` so
 * callers control how the candidate is identified in diagnostic output.
 *
 * @param content - Full page content including frontmatter.
 * @param filePath - Logical file path to embed in diagnostics (may be virtual).
 * @param schema - Resolved schema config.
 * @returns Lint results for this single page, empty when no violations found.
 */
export function checkPageCrossLinks(
  content: string,
  filePath: string,
  schema: SchemaConfig,
): LintResult[] {
  const { meta, body } = parseFrontmatter(content);
  const kind = resolvePageKind(meta.kind, schema);
  const rule = schema.kinds[kind];
  if (rule.minWikilinks <= 0) return [];

  const linkCount = countWikilinks(body);
  if (linkCount >= rule.minWikilinks) return [];

  return [
    {
      rule: "schema-cross-link-minimum",
      severity: "warning",
      file: filePath,
      message:
        `Page kind "${kind}" requires at least ${rule.minWikilinks} ` +
        `[[wikilinks]] but only ${linkCount} found.`,
    },
  ];
}

/**
 * Inspect a single page's content for ^[filename.md] citations referencing
 * missing source files, and flag claim-level spans whose line ranges exceed
 * the source file's actual length.
 *
 * @param content - Full page markdown including frontmatter.
 * @param filePath - Logical path embedded in diagnostics (may be virtual).
 * @param sourcesDir - Absolute path to the project's sources/ directory.
 * @param lineCountCache - Optional cross-page cache; provide one when
 *   linting many pages so source file line counts aren't re-read.
 */
export async function checkPageBrokenCitations(
  content: string,
  filePath: string,
  sourcesDir: string,
  lineCountCache: Map<string, number> = new Map(),
): Promise<LintResult[]> {
  const results: LintResult[] = [];
  for (const { captured, line } of findMatchesInContent(content, CITATION_PATTERN)) {
    await collectBrokenForMarker(captured, line, filePath, sourcesDir, lineCountCache, results);
  }
  return results;
}

/** Append broken-citation diagnostics for every entry inside a single ^[...] marker. */
async function collectBrokenForMarker(
  captured: string,
  line: number,
  pageFile: string,
  sourcesDir: string,
  lineCountCache: Map<string, number>,
  out: LintResult[],
): Promise<void> {
  for (const part of captured.split(",")) {
    const trimmed = part.trim();
    if (trimmed.length === 0) continue;
    const filename = stripSpanSuffix(trimmed);
    const citedPath = path.join(sourcesDir, filename);
    if (!existsSync(citedPath)) {
      out.push({
        rule: "broken-citation",
        severity: "error",
        file: pageFile,
        message: `Broken citation ^[${filename}] — source file not found`,
        line,
      });
      continue;
    }
    const range = parseLineRange(trimmed);
    if (range === null) continue;
    const lineCount = await resolveLineCount(citedPath, filename, lineCountCache);
    if (range.end <= lineCount) continue;
    out.push({
      rule: "broken-citation",
      severity: "error",
      file: pageFile,
      message: `Claim-level span ^[${trimmed}] is out of bounds (source has only ${lineCount} lines)`,
      line,
    });
  }
}

/** Return the line count for a source file, reading and caching if necessary. */
async function resolveLineCount(
  citedPath: string,
  filename: string,
  cache: Map<string, number>,
): Promise<number> {
  const cached = cache.get(filename);
  if (cached !== undefined) return cached;
  const content = await safeReadFile(citedPath);
  const lineCount = countLines(content);
  cache.set(filename, lineCount);
  return lineCount;
}

/**
 * Find ^[...] markers whose entries do not parse against the documented
 * paragraph or claim-level grammar (e.g. `^[file.md:abc]` or `^[file.md#X]`).
 * Detects malformed claim-level citations without breaking the paragraph form.
 */
export function checkPageMalformedCitations(content: string, filePath: string): LintResult[] {
  const results: LintResult[] = [];
  for (const { captured, line } of findMatchesInContent(content, CITATION_PATTERN)) {
    for (const part of captured.split(",")) {
      if (!isMalformedCitationEntry(part)) continue;
      results.push({
        rule: "malformed-claim-citation",
        severity: "error",
        file: filePath,
        message: `Malformed claim citation ^[${captured}] — expected file.md, file.md:N-N, or file.md#LN-LN`,
        line,
      });
    }
  }
  return results;
}

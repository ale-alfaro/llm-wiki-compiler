/**
 * Compilation orchestrator for the llmwiki knowledge compiler.
 *
 * Coordinates the full pipeline: lock acquisition, change detection,
 * concept extraction via LLM, wiki page generation with streaming output,
 * orphan marking for deleted sources, interlink resolution, and index
 * generation. Supports incremental compilation — only new or changed
 * sources are processed through the LLM pipeline.
 *
 * The pipeline operates on a `CompilePaths` snapshot built once at the
 * entry point so the vault and output directories may sit anywhere on
 * disk while `.llmwiki/` (state, lock, candidates) stays anchored at the
 * project root.
 */

import { readFile } from "fs/promises";
import path from "path";
import { readState, updateSourceState } from "../utils/state.js";
import {
  buildExtractionSourceStates,
  pickStatesForSources,
} from "./source-state.js";
import {
  atomicWrite,
  buildFrontmatter,
  parseFrontmatter,
  safeReadFile,
  validateWikiPage,
  slugify,
} from "../utils/markdown.js";
import { callClaude } from "../utils/llm.js";
import { acquireLock, releaseLock } from "../utils/lock.js";
import {
  CONCEPT_EXTRACTION_TOOL,
  buildExtractionPrompt,
  parseConcepts,
} from "./prompts.js";
import { loadSchema, type SchemaConfig } from "../schema/index.js";
import { detectChanges, hashFile } from "./hasher.js";
import {
  findAffectedSources,
  findFrozenSlugs,
  findLateAffectedSources,
  freezeFailedExtractions,
  persistFrozenSlugs,
  type ExtractionResult,
} from "./deps.js";
import { markOrphaned, orphanUnownedFrozenPages } from "./orphan.js";
import { resolveLinks } from "./resolver.js";
import { generateIndex } from "./indexgen.js";
import { mergeExtractions, type MergedConcept } from "./merge.js";
import { generateSeedPages } from "./seed-pages.js";
import { generateMOC } from "./obsidian.js";
import { writeCandidate } from "./candidates.js";
import {
  checkPageBrokenCitations,
  checkPageCrossLinks,
  checkPageMalformedCitations,
} from "../linter/rules.js";
import type { LintResult } from "../linter/types.js";
import { renderMergedPageContent } from "./page-renderer.js";
import * as output from "../utils/output.js";
import { COMPILE_CONCURRENCY } from "../utils/constants.js";
import { resolveCompilePaths } from "../utils/paths.js";
import pLimit from "p-limit";
import type {
  CompileOptions,
  CompilePaths,
  CompileResult,
  ExtractedConcept,
  ReviewCandidate,
  SourceChange,
  SourceState,
  WikiFrontmatter,
  WikiState,
} from "../utils/types.js";

/** Per-source state snapshots keyed by source filename. */
type SourceStateMap = Record<string, SourceState>;

/** Empty CompileResult used when no pipeline work runs (e.g. lock contention). */
function emptyCompileResult(): CompileResult {
  return { compiled: 0, skipped: 0, deleted: 0, concepts: [], pages: [], errors: [] };
}

/**
 * Run the full compilation pipeline with lock protection.
 * Acquires .llmwiki/lock, detects changes, compiles new/changed sources,
 * marks orphaned pages, resolves interlinks, and rebuilds the index.
 * @param root - Project root directory.
 * @param options - Optional pipeline overrides (e.g. --review mode, vault path).
 */
export async function compile(root: string, options: CompileOptions = {}): Promise<void> {
  await compileAndReport(root, options);
}

/**
 * Run the full compilation pipeline and return a structured result.
 * @param root - Project root directory.
 * @param options - Optional pipeline overrides.
 * @returns Structured result describing what was compiled.
 */
export async function compileAndReport(
  root: string,
  options: CompileOptions = {},
): Promise<CompileResult> {
  output.header("llmwiki compile");

  const paths = resolveCompilePaths(root, options);
  reportPathOverrides(paths, options);

  const locked = await acquireLock(paths.root);
  if (!locked) {
    output.status("!", output.error("Could not acquire lock. Try again later."));
    return {
      ...emptyCompileResult(),
      errors: ["Could not acquire .llmwiki/lock — another compile is in progress."],
    };
  }

  try {
    return await runCompilePipeline(paths, options);
  } finally {
    await releaseLock(paths.root);
  }
}

/** Log resolved vault/output/include when the user overrode any of them. */
function reportPathOverrides(paths: CompilePaths, options: CompileOptions): void {
  if (options.vault) output.status("i", output.dim(`Vault: ${paths.vault}`));
  if (options.output) output.status("i", output.dim(`Output: ${paths.output}`));
  if (paths.include) output.status("i", output.dim(`Include: ${paths.include}`));
}

/** Buckets of source changes used by the compile pipeline. */
interface ChangeBuckets {
  toCompile: SourceChange[];
  deleted: SourceChange[];
  unchanged: SourceChange[];
}

/** Sort source changes into the buckets the pipeline acts on. */
function bucketChanges(changes: SourceChange[]): ChangeBuckets {
  return {
    toCompile: changes.filter((c) => c.status === "new" || c.status === "changed"),
    deleted: changes.filter((c) => c.status === "deleted"),
    unchanged: changes.filter((c) => c.status === "unchanged"),
  };
}

/** Result of phase 2: page writes plus any errors collected along the way. */
interface PageGenerationResult {
  pages: MergedConcept[];
  errors: string[];
  /** Candidate ids written when running in --review mode. Empty otherwise. */
  candidates: string[];
}

/** Phase 2: generate pages for merged concepts in parallel, capturing errors. */
async function generatePagesPhase(
  paths: CompilePaths,
  extractions: ExtractionResult[],
  frozenSlugs: Set<string>,
  schema: SchemaConfig,
  options: CompileOptions,
): Promise<PageGenerationResult> {
  const merged = mergeExtractions(extractions, frozenSlugs);
  // Build the per-source state snapshot once so each candidate can carry the
  // exact data needed to mark its sources compiled on approval.
  const sourceStates = options.review
    ? await buildExtractionSourceStates(paths, extractions)
    : {};
  const limit = pLimit(COMPILE_CONCURRENCY);
  const errors: string[] = [];
  const candidates: string[] = [];
  const pages = await Promise.all(
    merged.map((entry) => limit(async () => {
      const result = await generateMergedPage(paths, entry, schema, options, sourceStates);
      if (result.error) errors.push(result.error);
      if (result.candidateId) candidates.push(result.candidateId);
      return entry;
    })),
  );
  return { pages, errors, candidates };
}

/** Persist source state for every extraction that produced concepts. */
async function persistExtractionStates(
  paths: CompilePaths,
  extractions: ExtractionResult[],
): Promise<void> {
  for (const result of extractions) {
    if (result.concepts.length === 0) continue;
    await persistSourceState(paths.root, result.sourcePath, result.sourceFile, result.concepts);
  }
}

/** Build the structured CompileResult and emit the CLI completion banner. */
function summarizeCompile(
  buckets: ChangeBuckets,
  generation: PageGenerationResult,
  extractions: ExtractionResult[],
  options: CompileOptions,
): CompileResult {
  output.header("Compilation complete");
  output.status("✓", output.success(
    `${buckets.toCompile.length} compiled, ${buckets.unchanged.length} skipped, ${buckets.deleted.length} deleted`,
  ));
  if (options.review && generation.candidates.length > 0) {
    output.status("?", output.info(
      `${generation.candidates.length} candidate(s) awaiting review — run \`llmwiki review list\``,
    ));
  }

  const errors = [...generation.errors];
  for (const result of extractions) {
    if (result.concepts.length === 0) {
      errors.push(`No concepts extracted from ${result.sourceFile}`);
    }
  }

  const baseResult: CompileResult = {
    compiled: buckets.toCompile.length,
    skipped: buckets.unchanged.length,
    deleted: buckets.deleted.length,
    concepts: generation.pages.map((entry) => entry.concept.concept),
    pages: generation.pages.map((entry) => entry.slug),
    errors,
  };
  if (options.review) {
    baseResult.candidates = generation.candidates;
  }
  return baseResult;
}

/** Inner pipeline, runs under lock protection. Returns structured CompileResult. */
async function runCompilePipeline(
  paths: CompilePaths,
  options: CompileOptions,
): Promise<CompileResult> {
  const schema = await loadSchema(paths.root);
  reportSchemaStatus(schema);
  const state = await readState(paths.root);
  const changes = await detectChanges(paths, state);
  augmentWithAffectedSources(changes, findAffectedSources(state, changes));

  const buckets = bucketChanges(changes);
  if (buckets.toCompile.length === 0 && buckets.deleted.length === 0) {
    output.status("✓", output.success("Nothing to compile — all sources up to date."));
    // Seed pages are cheap deterministic writes — always run them even when
    // no source files changed, so adding a seed page to schema.json takes
    // effect on the next compile without needing a source file edit.
    if (!options.review) {
      const emptyGeneration: PageGenerationResult = { pages: [], errors: [], candidates: [] };
      await generateSeedPages(paths, schema, emptyGeneration);
      // Rebuild index/MOC so the newly-written seed pages become discoverable,
      // and propagate any seed-page validation errors into the returned result.
      await finalizeWiki(paths, emptyGeneration.pages);
      return {
        ...emptyCompileResult(),
        skipped: buckets.unchanged.length,
        errors: emptyGeneration.errors,
      };
    }
    return { ...emptyCompileResult(), skipped: buckets.unchanged.length };
  }

  printChangesSummary(changes);
  // In review mode the pipeline contract is "write candidates instead of
  // mutating wiki/". Deletion bookkeeping (orphan marking + frozen-slug
  // persistence) writes directly into wiki/ and updates state.json, so we
  // defer it to the next non-review compile pass. Source-state persistence
  // for compiled sources is also review-deferred — those entries land at
  // approve time so unapproved candidates remain re-detectable on subsequent
  // compiles.
  if (!options.review) {
    await markDeletedAsOrphaned(paths, buckets.deleted, state);
  }

  const frozenSlugs = findFrozenSlugs(state, changes);
  reportFrozenSlugs(frozenSlugs);

  const extractions = await runExtractionPhases(paths, buckets.toCompile, state, changes);
  if (!options.review) {
    await freezeFailedExtractions(paths.root, extractions, frozenSlugs);
  }

  const generation = await generatePagesPhase(paths, extractions, frozenSlugs, schema, options);

  if (!options.review) {
    await persistExtractionStates(paths, extractions);
    if (frozenSlugs.size > 0) {
      await orphanUnownedFrozenPages(paths, frozenSlugs);
    }
    await persistFrozenSlugs(paths.root, frozenSlugs, extractions);
    // Seed pages write directly into wiki/, so skip them in review mode
    // to honour the "no wiki/ mutation" contract of that mode.
    await generateSeedPages(paths, schema, generation);
    await finalizeWiki(paths, generation.pages);
  }
  return summarizeCompile(buckets, generation, extractions, options);
}

/** Log where the schema was loaded from so the user can confirm it was picked up. */
function reportSchemaStatus(schema: SchemaConfig): void {
  if (schema.loadedFrom) {
    output.status("i", output.dim(`Schema: ${schema.loadedFrom}`));
  }
}

/** Append affected-source changes (logging each addition) to the change list. */
function augmentWithAffectedSources(changes: SourceChange[], affected: string[]): void {
  for (const file of affected) {
    output.status("~", output.info(`${file} [affected by shared concept]`));
    changes.push({ file, status: "changed" });
  }
}

/** Mark wiki pages owned solely by deleted sources as orphaned. */
async function markDeletedAsOrphaned(
  paths: CompilePaths,
  deleted: SourceChange[],
  state: WikiState,
): Promise<void> {
  for (const del of deleted) {
    await markOrphaned(paths, del.file, state);
  }
}

/** Log frozen slugs (shared concepts whose deletion-pinned content must persist). */
function reportFrozenSlugs(frozenSlugs: Set<string>): void {
  for (const slug of frozenSlugs) {
    output.status("i", output.dim(`Frozen: ${slug} (shared with deleted source)`));
  }
}

/**
 * Phase 1: extract concepts for the directly-changed batch, then expand to
 * any unchanged sources whose concepts overlap with newly extracted slugs.
 */
async function runExtractionPhases(
  paths: CompilePaths,
  toCompile: SourceChange[],
  state: WikiState,
  allChanges: SourceChange[],
): Promise<ExtractionResult[]> {
  const extractions: ExtractionResult[] = [];
  for (const change of toCompile) {
    extractions.push(await extractForSource(paths, change.file));
  }

  const lateAffected = findLateAffectedSources(extractions, state, allChanges);
  for (const file of lateAffected) {
    output.status("~", output.info(`${file} [shares concept with new source]`));
    extractions.push(await extractForSource(paths, file));
  }

  return extractions;
}

/** Resolve interlinks and regenerate index/MOC after writes. */
async function finalizeWiki(paths: CompilePaths, pages: MergedConcept[]): Promise<void> {
  const allChangedSlugs = pages.map((entry) => entry.slug);
  const allNewSlugs = pages.filter((entry) => entry.concept.is_new).map((entry) => entry.slug);

  if (allChangedSlugs.length > 0) {
    output.status("🔗", output.info("Resolving interlinks..."));
    await resolveLinks(paths, allChangedSlugs, allNewSlugs);
  }

  await generateIndex(paths);
  await generateMOC(paths);
}

/** Print a summary of detected source file changes. */
function printChangesSummary(changes: SourceChange[]): void {
  const iconMap: Record<string, string> = {
    new: "+", changed: "~", unchanged: ".", deleted: "-",
  };
  const fmtMap: Record<string, (s: string) => string> = {
    new: output.success, changed: output.warn, unchanged: output.dim, deleted: output.error,
  };

  for (const c of changes) {
    const icon = iconMap[c.status] ?? "?";
    const fmt = fmtMap[c.status] ?? output.dim;
    output.status(icon, fmt(`${c.file} [${c.status}]`));
  }
}

/**
 * Phase 1: Extract concepts from a source without generating pages.
 * Returns extraction data for the generation phase.
 */
async function extractForSource(
  paths: CompilePaths,
  sourceFile: string,
): Promise<ExtractionResult> {
  output.status("*", output.info(`Extracting: ${sourceFile}`));

  const sourcePath = path.join(paths.vault, sourceFile);
  const sourceContent = await readFile(sourcePath, "utf-8");
  const existingIndex = await safeReadFile(paths.indexFile);
  const concepts = await extractConcepts(sourceContent, existingIndex);

  if (concepts.length > 0) {
    const names = concepts.map((c) => c.concept).join(", ");
    output.status("*", output.dim(`  Found ${concepts.length} concepts: ${names}`));
  }
  return { sourceFile, sourcePath, sourceContent, concepts };
}

/** Outcome of generating a single merged concept page. */
interface MergedPageOutcome {
  error?: string;
  candidateId?: string;
}

/**
 * Generate a wiki page from merged source content.
 * For shared concepts, the LLM sees content from all contributing sources
 * and frontmatter records every source file. When `options.review` is set,
 * the rendered page is persisted as a review candidate instead of being
 * written into `wiki/`.
 */
async function generateMergedPage(
  paths: CompilePaths,
  entry: MergedConcept,
  schema: SchemaConfig,
  options: CompileOptions,
  sourceStates: SourceStateMap,
): Promise<MergedPageOutcome> {
  const fullPage = await renderMergedPageContent(paths, entry, schema);

  if (options.review) {
    return await persistReviewCandidate(paths, entry, fullPage, sourceStates, schema);
  }

  const pagePath = path.join(paths.conceptsDir, `${entry.slug}.md`);
  const error = await writePageIfValid(pagePath, fullPage, entry.concept.concept);
  return { error: error ?? undefined };
}

/** Persist a candidate JSON record for later review and report it on stdout. */
async function persistReviewCandidate(
  paths: CompilePaths,
  entry: MergedConcept,
  fullPage: string,
  sourceStates: SourceStateMap,
  schema: SchemaConfig,
): Promise<MergedPageOutcome> {
  const virtualPath = `wiki/concepts/${entry.slug}.md`;
  const schemaViolations = checkPageCrossLinks(fullPage, virtualPath, schema);
  const provenanceViolations = await collectCandidateProvenanceViolations(
    paths,
    fullPage,
    virtualPath,
  );

  const candidate: ReviewCandidate = await writeCandidate(paths.root, {
    title: entry.concept.concept,
    slug: entry.slug,
    summary: entry.concept.summary,
    sources: entry.sourceFiles,
    body: fullPage,
    sourceStates: pickStatesForSources(sourceStates, entry.sourceFiles),
    schemaViolations: schemaViolations.length > 0 ? schemaViolations : undefined,
    provenanceViolations:
      provenanceViolations.length > 0 ? provenanceViolations : undefined,
  });
  output.status("?", output.info(`Candidate ready: ${candidate.id} (${entry.slug})`));
  return { candidateId: candidate.id };
}

/**
 * Run the in-memory provenance lint rules against a candidate body:
 * malformed claim citations + broken-source / out-of-bounds line spans.
 */
async function collectCandidateProvenanceViolations(
  paths: CompilePaths,
  fullPage: string,
  virtualPath: string,
): Promise<LintResult[]> {
  const malformed = checkPageMalformedCitations(fullPage, virtualPath);
  const broken = await checkPageBrokenCitations(
    fullPage,
    virtualPath,
    paths.vault,
  );
  return [...malformed, ...broken];
}

/** Call Claude to extract concepts from a source document. */
async function extractConcepts(
  sourceContent: string,
  existingIndex: string,
): Promise<ExtractedConcept[]> {
  const system = buildExtractionPrompt(sourceContent, existingIndex);
  const rawOutput = await callClaude({
    system,
    messages: [{ role: "user", content: "Extract the key concepts from this source." }],
    tools: [CONCEPT_EXTRACTION_TOOL],
  });

  return parseConcepts(rawOutput);
}

/** Validate and atomically write a wiki page, logging the result. */
async function writePageIfValid(
  pagePath: string,
  content: string,
  conceptTitle: string,
): Promise<string | null> {
  if (!validateWikiPage(content)) {
    output.status("!", output.warn(`Invalid page for "${conceptTitle}" — skipped.`));
    return `Invalid page for "${conceptTitle}" — failed validation`;
  }

  await atomicWrite(pagePath, content);
  return null;
}

/** Update the persisted state for a compiled source file. */
async function persistSourceState(
  root: string,
  sourcePath: string,
  sourceFile: string,
  concepts: ReturnType<typeof parseConcepts>,
): Promise<void> {
  const hash = await hashFile(sourcePath);
  const entry: SourceState = {
    hash,
    concepts: concepts.map((c) => slugify(c.concept)),
    compiledAt: new Date().toISOString(),
  };

  await updateSourceState(root, sourceFile, entry);
}

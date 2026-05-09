/**
 * Core type definitions for the llmwiki knowledge compiler.
 * All shared interfaces live here to keep the module boundary clean.
 */

import type { PageKind } from "../schema/types.js";

/**
 * Lifecycle state of a concept or page's provenance.
 * - `extracted`: drawn directly from a source document.
 * - `merged`: synthesised from multiple sources during compilation.
 * - `inferred`: produced by the model from context, not directly cited.
 * - `ambiguous`: sources disagree or evidence is conflicting.
 */
export type ProvenanceState = "extracted" | "merged" | "inferred" | "ambiguous";

/**
 * Reference to another concept that contradicts the current one.
 * The slug points to the contradicting wiki page.
 */
export interface ContradictionRef {
  slug: string;
  reason?: string;
}

/** A single concept extracted from a source by the LLM. */
export interface ExtractedConcept {
  concept: string;
  summary: string;
  is_new: boolean;
  tags?: string[];
  /** Numeric confidence in 0..1 — how certain the model is in this concept. */
  confidence?: number;
  /** Lifecycle state describing how this concept was produced. */
  provenanceState?: ProvenanceState;
  /** Slugs of concepts whose evidence contradicts this one. */
  contradictedBy?: ContradictionRef[];
  /**
   * Number of paragraphs the model considers inferred (not directly extracted).
   * Used by the inferred-without-citations lint rule.
   */
  inferredParagraphs?: number;
}

/** Per-source entry in .llmwiki/state.json. */
export interface SourceState {
  hash: string;
  concepts: string[];
  compiledAt: string;
}

/** Root shape of .llmwiki/state.json. */
export interface WikiState {
  version: 1;
  indexHash: string;
  sources: Record<string, SourceState>;
  /** Concept slugs frozen across batches to preserve content from deleted sources. */
  frozenSlugs?: string[];
}

/** Change detection result for a single source file. */
export interface SourceChange {
  file: string;
  status: "new" | "changed" | "unchanged" | "deleted";
}

/** Wiki page frontmatter parsed from YAML. */
export interface WikiFrontmatter {
  title: string;
  sources: string[];
  summary: string;
  orphaned?: boolean;
  tags?: string[];
  aliases?: string[];
  createdAt: string;
  updatedAt: string;
  /**
   * Optional typed page kind. Defaults to "concept" when absent so existing
   * pages compiled before the schema layer existed continue to work.
   * Uses the canonical PageKind union from the schema layer — import is
   * type-only so it is erased at compile time and creates no runtime cycle.
   */
  kind?: PageKind;
  /** Numeric confidence in 0..1 — overall confidence in the page's claims. */
  confidence?: number;
  /** Lifecycle state describing how the page's content was produced. */
  provenanceState?: ProvenanceState;
  /** Slugs of pages whose evidence contradicts this one. */
  contradictedBy?: ContradictionRef[];
  /** Number of inferred paragraphs in the page body without direct citations. */
  inferredParagraphs?: number;
}

/** Summary entry used in index.md generation. */
export interface PageSummary {
  title: string;
  slug: string;
  summary: string;
}

/** Structured result returned by the compile pipeline. */
export interface CompileResult {
  compiled: number;
  skipped: number;
  deleted: number;
  concepts: string[];
  pages: string[];
  errors: string[];
  /** Candidate IDs created when the pipeline runs in --review mode. */
  candidates?: string[];
}

/** Optional behaviour controls for the compile pipeline. */
export interface CompileOptions {
  /**
   * Write generated pages as candidates under .llmwiki/candidates/ instead
   * of mutating wiki/. Reviewers approve/reject via `llmwiki review`.
   */
  review?: boolean;
  /**
   * Override where the pipeline reads source markdown from. Defaults to
   * `<root>/sources` so existing flat-sources projects keep working without
   * setting anything. May be absolute or relative to `root`.
   */
  vault?: string;
  /**
   * Override where compiled `wiki/` artifacts (concepts, index, MOC) are
   * written. Defaults to `<root>/wiki`. May be absolute or relative to `root`.
   */
  output?: string;
  /**
   * Optional glob (e.g. `Zephyr/**`) that scopes which vault notes are
   * compiled. Matched against vault-relative paths via `path.matchesGlob`.
   */
  include?: string;
}

/**
 * Resolved absolute paths the compile pipeline reads and writes.
 *
 * Built once at the entry point from `CompileOptions` and threaded through
 * the pipeline so individual functions don't need to re-derive paths from
 * `root` plus a constant. Lets the vault and output directories sit anywhere
 * on disk — the project root only owns `.llmwiki/` (state + lock + candidates).
 */
export interface CompilePaths {
  /** Project root — anchors `.llmwiki/` (state.json, lock, candidates). */
  root: string;
  /** Absolute path to the vault directory containing source markdown. */
  vault: string;
  /** Absolute path to the output directory containing compiled wiki pages. */
  output: string;
  /** Absolute path to `<output>/concepts`. */
  conceptsDir: string;
  /** Absolute path to `<output>/index.md`. */
  indexFile: string;
  /** Absolute path to `<output>/MOC.md`. */
  mocFile: string;
  /** Optional include glob applied to vault-relative paths. */
  include?: string;
}

/**
 * A pending wiki page change awaiting human review. Persisted as JSON under
 * .llmwiki/candidates/<id>.json when compile is run with --review.
 */
export interface ReviewCandidate {
  /** Stable identifier used by the review CLI commands. */
  id: string;
  /** Human-readable concept title. */
  title: string;
  /** Filename slug that the page would be written to. */
  slug: string;
  /** Short summary copied from the LLM extraction. */
  summary: string;
  /** Source filenames that contributed to this candidate. */
  sources: string[];
  /** Full page content (frontmatter + body) ready to be written verbatim. */
  body: string;
  /** ISO timestamp recorded when the candidate was generated. */
  generatedAt: string;
  /**
   * Per-source incremental-state snapshots captured at compile time.
   *
   * Approving the candidate persists these into `.llmwiki/state.json` so the
   * source files are marked compiled and won't be reprocessed on the next
   * `compile` run. Without this, approved candidates would silently
   * regenerate on every subsequent compile.
   */
  sourceStates?: Record<string, SourceState>;
  /**
   * Schema lint violations detected at candidate-generation time.
   *
   * Populated when the candidate body violates a schema rule (e.g. fewer
   * wikilinks than the kind's `minWikilinks` requires). Only set when at
   * least one violation exists — absent when the candidate is clean.
   * `review show` surfaces these so reviewers see failures before approving.
   */
  schemaViolations?: import("../linter/types.js").LintResult[];
  /**
   * Provenance lint violations detected at candidate-generation time.
   *
   * Covers malformed claim citations (`^[file.md:abc]`), out-of-bounds
   * line spans, and citations referencing source files that don't exist.
   * Surfaced in `review show` next to schema violations so reviewers
   * catch citation issues before approving — these used to only show up
   * on the next normal `compile` after the page was already promoted.
   */
  provenanceViolations?: import("../linter/types.js").LintResult[];
}

/**
 * A single source span pointing back into ingested source text.
 * Spans are inclusive on both ends and 1-indexed when referring to lines,
 * mirroring the way humans cite editor line numbers.
 */
export interface SourceSpan {
  /** Source filename (e.g. `paper.md`) — always relative to `sources/`. */
  file: string;
  /** Optional inclusive line range; `start` and `end` may be equal. */
  lines?: { start: number; end: number };
}

/**
 * A claim-level citation parsed from a `^[file.md:42-58]` or
 * `^[file.md#L42-L58]` marker. The plain `^[file.md]` form parses with
 * `spans[i].lines` undefined, preserving paragraph-level provenance.
 */
export interface ClaimCitation {
  /** Raw text inside the brackets, useful for diagnostics. */
  raw: string;
  /** One or more source spans contributed by this marker. */
  spans: SourceSpan[];
}

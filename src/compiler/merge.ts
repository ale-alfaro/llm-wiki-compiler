/**
 * Concept merging for the compile pipeline.
 *
 * When multiple sources extract the same concept slug, we want a single page
 * that reflects all contributing material rather than just the last source
 * processed. This module reconciles the per-concept metadata (confidence,
 * provenance, contradictions) and packages the combined source content
 * through the prompt-budget so popular concepts don't blow past the LLM
 * context window.
 */

import { slugify } from "../utils/markdown.js";
import { buildBudgetedCombinedContent, type SourceSlice } from "./prompt-budget.js";
import type { ExtractionResult } from "./deps.js";
import type { ExtractedConcept } from "../utils/types.js";

/** A concept with all contributing sources merged for generation. */
export interface MergedConcept {
  slug: string;
  concept: ExtractedConcept;
  sourceFiles: string[];
  combinedContent: string;
}

/**
 * Reconcile metadata from a later-extracted concept into an existing merged entry.
 *
 * Rules:
 * - confidence: min (most pessimistic value wins)
 * - provenanceState: always 'merged' once two sources are involved
 * - contradictedBy: union by slug (deduplicating on slug identity)
 * - inferredParagraphs: max (any source claiming inference wins)
 */
function reconcileConceptMetadata(
  existing: ExtractedConcept,
  incoming: ExtractedConcept,
): ExtractedConcept {
  const reconciled = { ...existing };

  if (typeof incoming.confidence === "number") {
    reconciled.confidence = typeof existing.confidence === "number"
      ? Math.min(existing.confidence, incoming.confidence)
      : incoming.confidence;
  }

  reconciled.provenanceState = "merged";

  const refs = [...(existing.contradictedBy ?? [])];
  const seenSlugs = new Set(refs.map((r) => r.slug));
  for (const ref of incoming.contradictedBy ?? []) {
    if (!seenSlugs.has(ref.slug)) {
      refs.push(ref);
      seenSlugs.add(ref.slug);
    }
  }
  reconciled.contradictedBy = refs.length > 0 ? refs : undefined;

  if (typeof incoming.inferredParagraphs === "number") {
    reconciled.inferredParagraphs = typeof existing.inferredParagraphs === "number"
      ? Math.max(existing.inferredParagraphs, incoming.inferredParagraphs)
      : incoming.inferredParagraphs;
  }

  return reconciled;
}

/**
 * Merge extractions so each concept slug maps to ALL contributing sources.
 * Combined content is run through {@link buildBudgetedCombinedContent} so
 * popular concepts that appear in many overlapping sources do not blow past
 * the LLM provider's context window.
 *
 * @param extractions - All per-source extraction results from phase 1.
 * @param frozenSlugs - Slugs whose pages must be preserved as-is (skipped here).
 */
export function mergeExtractions(
  extractions: ExtractionResult[],
  frozenSlugs: Set<string>,
): MergedConcept[] {
  const bySlug = new Map<string, MergedConcept>();
  const slicesBySlug = new Map<string, SourceSlice[]>();

  for (const result of extractions) {
    if (result.concepts.length === 0) continue;

    for (const concept of result.concepts) {
      const slug = slugify(concept.concept);
      if (frozenSlugs.has(slug)) continue;

      const existing = bySlug.get(slug);
      if (existing) {
        existing.concept = reconcileConceptMetadata(existing.concept, concept);
        existing.sourceFiles.push(result.sourceFile);
      } else {
        bySlug.set(slug, {
          slug,
          concept,
          sourceFiles: [result.sourceFile],
          combinedContent: "",
        });
        slicesBySlug.set(slug, []);
      }
      slicesBySlug.get(slug)!.push({
        file: result.sourceFile,
        content: result.sourceContent,
      });
    }
  }

  for (const merged of bySlug.values()) {
    const slices = slicesBySlug.get(merged.slug) ?? [];
    merged.combinedContent = buildBudgetedCombinedContent(
      merged.concept.concept,
      slices,
    );
  }

  return Array.from(bySlug.values());
}

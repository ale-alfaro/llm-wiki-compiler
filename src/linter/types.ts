/**
 * Type definitions for the wiki linter.
 * Defines the shape of lint results emitted by the in-memory rules used
 * during candidate validation in the compile pipeline.
 */

export interface LintResult {
  rule: string;
  severity: "error" | "warning" | "info";
  file: string;
  message: string;
  line?: number;
}

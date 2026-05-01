import { describe, it, expect, beforeEach } from "vitest";
import { writeFile } from "fs/promises";
import path from "path";
import { buildFrontmatter } from "../src/utils/markdown.js";
import { makeTempRoot } from "./fixtures/temp-root.js";
import { writePage } from "./fixtures/write-page.js";
import { generateAndReadIndex } from "./fixtures/generate-and-read-index.js";

describe("generateIndex", () => {
  let root: string;

  beforeEach(async () => {
    root = await makeTempRoot("idx");
  });

  it("includes concept pages in the index", async () => {
    await writePage(path.join(root, "wiki/concepts"), "alpha", { title: "Alpha", summary: "First concept" }, "Body of Alpha.");
    const index = await generateAndReadIndex(root);

    expect(index).toContain("[[alpha|Alpha]]");
    expect(index).toContain("First concept");
    expect(index).toContain("## Concepts");
  });

  it("reports correct total page count", async () => {
    await writePage(path.join(root, "wiki/concepts"), "a", { title: "A", summary: "s" }, "Body.");
    await writePage(path.join(root, "wiki/concepts"), "b", { title: "B", summary: "s" }, "Body.");
    const index = await generateAndReadIndex(root);

    expect(index).toContain("2 pages");
  });

  it("handles empty wiki gracefully", async () => {
    const index = await generateAndReadIndex(root);

    expect(index).toContain("0 pages");
  });

  it("excludes orphaned pages from the index", async () => {
    await writePage(path.join(root, "wiki/concepts"), "alive", { title: "Alive", summary: "Still here" }, "Body of Alive.");
    const orphanFm = buildFrontmatter({ title: "Dead", summary: "Gone", orphaned: true });
    await writeFile(
      path.join(root, "wiki/concepts/dead.md"),
      `${orphanFm}\n\nOrphaned content.\n`,
    );
    const index = await generateAndReadIndex(root);

    expect(index).toContain("[[alive|Alive]]");
    expect(index).not.toContain("[[dead|Dead]]");
    expect(index).toContain("1 pages");
  });
});

import { describe, expect, it } from "vitest";
import { harborGlossary } from "../data/harbor-glossary";

describe("harbor glossary", () => {
  it("has entries with unique ids and every field filled", () => {
    const ids = harborGlossary.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(harborGlossary.length).toBeGreaterThanOrEqual(22);
    for (const entry of harborGlossary) {
      for (const field of ["term", "title", "definition", "code", "whenToUse"] as const) {
        expect(entry[field].trim(), `${entry.id}.${field}`).not.toBe("");
      }
      expect(entry.chapter, `${entry.id} chapter`).toBeGreaterThanOrEqual(1);
      expect(entry.chapter, `${entry.id} chapter`).toBeLessThanOrEqual(10);
    }
  });

  it("covers every shift so no chapter has an empty reference", () => {
    const covered = new Set(harborGlossary.map((e) => e.chapter));
    for (let chapter = 1; chapter <= 10; chapter++) {
      expect(covered.has(chapter), `chapter ${chapter} covered`).toBe(true);
    }
  });
});

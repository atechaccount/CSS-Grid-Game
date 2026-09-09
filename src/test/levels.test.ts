import { describe, expect, it } from "vitest";
import { chapters } from "../data/chapters";
import { levels, levelsForChapter } from "../data/levels";
import { usefulToolsForLevel } from "../engine/level-tools";

describe("chapter property notes", () => {
  it("gives every shift a per-property explanation of exactly what each tool does", () => {
    for (const chapter of chapters) {
      expect(chapter.properties.length, `${chapter.title} has property notes`).toBeGreaterThan(0);
      const names = chapter.properties.map((p) => p.name);
      expect(new Set(names).size, `${chapter.title} property names unique`).toBe(names.length);
      for (const prop of chapter.properties) {
        expect(prop.name.trim(), `${chapter.title} name`).not.toBe("");
        expect(prop.does.trim(), `${chapter.title}: ${prop.name} explanation`).not.toBe("");
        // Explanations are sentences, not headings: they should say what happens.
        expect(prop.does.length, `${chapter.title}: ${prop.name} explanation length`).toBeGreaterThan(
          30,
        );
      }
    }
  });

  it("keeps the shift's property names consistent with its concepts list", () => {
    for (const chapter of chapters) {
      const concepts = chapter.concepts.join(" ");
      for (const prop of chapter.properties) {
        // A property note teaches a tool the shift actually names (modulo shorthand wording).
        const head = prop.name.replace(/[():]/g, " ").trim().split(/\s+/)[0];
        expect(
          concepts.toLowerCase(),
          `${chapter.title}: ${prop.name} should relate to its concepts`,
        ).toContain(head.toLowerCase().split("-")[0]);
      }
    }
  });
});

describe("level data integrity", () => {
  it("holds the full campaign: 76 berths across 10 shifts", () => {
    expect(levels).toHaveLength(76);
    expect(chapters).toHaveLength(10);
    for (let chapter = 1; chapter <= 10; chapter++) {
      expect(levelsForChapter(chapter).length, `chapter ${chapter}`).toBeGreaterThan(0);
    }
  });

  it("gives every level a unique id and a clean per-chapter order", () => {
    const ids = levels.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const chapter of chapters) {
      const inChapter = levelsForChapter(chapter.id);
      inChapter.forEach((level, index) => {
        expect(level.order, `${level.id} order`).toBe(index + 1);
      });
    }
  });

  it("fills every narrative field, hint rung, and concept list", () => {
    for (const level of levels) {
      for (const field of [
        "title",
        "story",
        "objective",
        "explanation",
        "whyItWorked",
        "realWorld",
      ] as const) {
        expect(level[field].trim(), `${level.id}.${field}`).not.toBe("");
      }
      expect(level.hints, `${level.id} hints`).toHaveLength(3);
      level.hints.forEach((hint, i) => {
        expect(hint.trim(), `${level.id} hint ${i + 1}`).not.toBe("");
      });
      expect(level.concepts.length, `${level.id} concepts`).toBeGreaterThan(0);
      expect(level.items.length, `${level.id} items`).toBeGreaterThan(0);
      expect(new Set(level.items.map((i) => i.id)).size, `${level.id} item ids`).toBe(
        level.items.length,
      );
      expect(level.starterCSS.trim(), `${level.id} starter`).not.toBe("");
      expect(level.solutionCSS.trim(), `${level.id} solution`).not.toBe("");
      expect(level.difficulty, `${level.id} difficulty`).toMatch(
        /^(tutorial|practice|challenge|review|boss)$/,
      );
    }
  });

  it("only mandates tools in requireCSS/forbidCSS that relate to the solution", () => {
    for (const level of levels) {
      for (const token of level.requireCSS ?? []) {
        expect(
          cssMentions(level.solutionCSS, token),
          `${level.id} requires ${token} but the solution never uses it`,
        ).toBe(true);
      }
      for (const token of level.forbidCSS ?? []) {
        expect(
          cssMentions(level.solutionCSS, token),
          `${level.id} forbids ${token} but the solution uses it`,
        ).toBe(false);
      }
    }
  });

  it("derives the useful-tool reveal strictly from solution properties missing in the starter", () => {
    for (const level of levels) {
      const tools = usefulToolsForLevel(level);
      expect(tools.length, `${level.id} should name at least one tool`).toBeGreaterThan(0);
      for (const tool of tools) {
        const pattern = new RegExp(`(^|\\s|;)${tool}\\s*:`, "m");
        expect(pattern.test(level.solutionCSS), `${level.id} tool ${tool} in solution`).toBe(
          true,
        );
      }
    }
  });
});

function cssMentions(css: string, token: string): boolean {
  const bare = token.replace(/[(]$/, "");
  return css.includes(bare);
}

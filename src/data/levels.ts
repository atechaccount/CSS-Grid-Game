import type { Level } from "../types";
import { earlyLevels } from "./levels-early";
import { lateLevels } from "./levels-late";

export const levels: Level[] = [...earlyLevels, ...lateLevels];

export function levelsForChapter(chapter: number): Level[] {
  return levels.filter((l) => l.chapter === chapter).sort((a, b) => a.order - b.order);
}

export function getLevel(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}

export function getNextLevel(id: string): Level | undefined {
  const idx = levels.findIndex((l) => l.id === id);
  if (idx < 0 || idx === levels.length - 1) return undefined;
  return levels[idx + 1];
}

export function firstLevelOf(chapter: number): Level | undefined {
  return levelsForChapter(chapter)[0];
}

export function chapterComplete(chapter: number, completed: string[]): boolean {
  const ids = levelsForChapter(chapter).map((l) => l.id);
  return ids.length > 0 && ids.every((id) => completed.includes(id));
}

export function firstIncomplete(completed: string[], unlockedChapter: number): Level {
  const available = levels.filter((l) => l.chapter <= unlockedChapter);
  return available.find((l) => !completed.includes(l.id)) ?? available[available.length - 1] ?? levels[0];
}

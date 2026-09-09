import type { Progress } from "../types";

const KEY = "skydock-progress-v1";

export const defaultProgress = (): Progress => ({
  completed: [],
  unlockedChapter: 1,
  lastLevelId: null,
  drafts: {},
  hintsUsed: {},
  solutionsRevealed: [],
  badges: [],
  seenLessons: [],
  overlay: { lines: true, numbers: true, labels: true },
  seenTitle: false,
});

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...defaultProgress(), ...parsed, overlay: { ...defaultProgress().overlay, ...parsed.overlay } };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function resetProgress(): Progress {
  const fresh = defaultProgress();
  saveProgress(fresh);
  return fresh;
}

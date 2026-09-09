import type { Progress } from "../types";

const LEGACY_KEY = "skydock-progress-v1";

/**
 * Progress lives in localStorage, which is scoped to the origin, not the path. Every deployment
 * under https://atechaccount.github.io/ (production, each pr-preview, anything else on the host)
 * would otherwise share one save and a preview could corrupt real progress. The build-time base
 * path ("/CSS-Grid-Game/" in production, "/CSS-Grid-Game/pr-preview/pr-<n>/" in a preview, "/" in
 * dev) is unique per deployment, so it namespaces the key.
 */
function storageKey(): string {
  return `${LEGACY_KEY}:${import.meta.env.BASE_URL || "/"}`;
}

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

function parse(raw: string): Progress | null {
  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      ...defaultProgress(),
      ...parsed,
      overlay: { ...defaultProgress().overlay, ...parsed.overlay },
    };
  } catch {
    return null;
  }
}

export function loadProgress(): Progress {
  const named = localStorage.getItem(storageKey());
  if (named) {
    const parsed = parse(named);
    if (parsed) return parsed;
  }
  // One-time migration: pre-namespaced saves were written under the bare key by every
  // deployment on the host. Copy the save forward instead of losing it; the old key is left
  // in place and simply never read again by this version.
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    const parsed = parse(legacy);
    if (parsed) return parsed;
  }
  return defaultProgress();
}

export function saveProgress(p: Progress): void {
  localStorage.setItem(storageKey(), JSON.stringify(p));
}

export function resetProgress(): Progress {
  const fresh = defaultProgress();
  saveProgress(fresh);
  return fresh;
}

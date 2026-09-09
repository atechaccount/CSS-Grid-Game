import { beforeEach, describe, expect, it } from "vitest";
import {
  defaultProgress,
  loadProgress,
  resetProgress,
  saveProgress,
} from "../store/progress";

beforeEach(() => {
  localStorage.clear();
});

describe("progress store", () => {
  it("saves under a base-path-namespaced key so previews cannot clobber production", () => {
    const progress = defaultProgress();
    progress.completed = ["c1-01"];
    saveProgress(progress);

    const keys = Object.keys(localStorage);
    // import.meta.env.BASE_URL is "/" in the test environment, "/CSS-Grid-Game/" in production,
    // "/CSS-Grid-Game/pr-preview/pr-<n>/" in a pull request preview.
    expect(keys).toContain("skydock-progress-v1:/");
    expect(keys).not.toContain("skydock-progress-v1");
  });

  it("round-trips a save", () => {
    const progress = defaultProgress();
    progress.completed = ["c1-01", "c1-02"];
    progress.drafts = { "c1-01": ".harbor { color: red }" };
    progress.overlay = { lines: false, numbers: true, labels: false };
    saveProgress(progress);

    const loaded = loadProgress();
    expect(loaded.completed).toEqual(["c1-01", "c1-02"]);
    expect(loaded.drafts["c1-01"]).toContain("color: red");
    expect(loaded.overlay).toEqual({ lines: false, numbers: true, labels: false });
  });

  it("migrates a legacy save written under the un-namespaced key", () => {
    const legacy = { ...defaultProgress(), unlockedChapter: 2, completed: ["c1-01", "c1-02", "c1-03"] };
    localStorage.setItem("skydock-progress-v1", JSON.stringify(legacy));

    const loaded = loadProgress();
    expect(loaded.completed).toEqual(["c1-01", "c1-02", "c1-03"]);
    // The removed shift-sealing field is dropped on load (and only the next save persists it).
    expect(loaded).not.toHaveProperty("unlockedChapter");
    expect(localStorage.getItem("skydock-progress-v1:/")).toBeNull();
  });

  it("prefers the namespaced save over a stale legacy copy", () => {
    const named = defaultProgress();
    named.completed = ["c2-01"];
    localStorage.setItem("skydock-progress-v1:/", JSON.stringify(named));
    const legacy = defaultProgress();
    legacy.completed = ["c1-01"];
    localStorage.setItem("skydock-progress-v1", JSON.stringify(legacy));

    expect(loadProgress().completed).toEqual(["c2-01"]);
  });

  it("falls back to defaults on corrupt JSON", () => {
    localStorage.setItem("skydock-progress-v1:/", "{not json");
    const loaded = loadProgress();
    expect(loaded).toEqual(defaultProgress());
  });

  it("reset returns a fresh save and persists it", () => {
    const progress = defaultProgress();
    progress.completed = ["c1-01"];
    saveProgress(progress);

    const fresh = resetProgress();
    expect(fresh.completed).toEqual([]);
    expect(loadProgress().completed).toEqual([]);
  });
});

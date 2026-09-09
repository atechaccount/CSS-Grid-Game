import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorView } from "@codemirror/view";
import { act, useState } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { CssEditor } from "../components/CssEditor";
import { HarborGlossary } from "../components/HarborGlossary";
import { PlayScreen } from "../components/PlayScreen";
import { getLevel, levels } from "../data/levels";
import { defaultProgress } from "../store/progress";
import type { Progress } from "../types";
import { setViewport } from "./setup";

/**
 * Stateful harness mirroring how App mounts PlayScreen: it owns the progress state so
 * onProgress patches (drafts, hints, completed, badges) actually stick, reports every patch
 * to a spy, and can be re-rendered at a new level id the way onGoto does.
 */
function PlayHarness({
  levelId,
  progress: seed,
  onProgressPatch,
  onMap,
  onWinGame,
}: {
  levelId: string;
  progress: Progress;
  onProgressPatch?: (next: Progress) => void;
  onMap?: () => void;
  onWinGame?: () => void;
}) {
  const [progress, setProgress] = useState(seed);
  const patch = (next: Progress) => {
    onProgressPatch?.(next);
    setProgress(next);
  };
  return (
    <PlayScreen
      level={getLevel(levelId)!}
      progress={progress}
      onProgress={patch}
      onMap={onMap ?? (() => {})}
      onGoto={() => {}}
      onWinGame={onWinGame ?? (() => {})}
    />
  );
}

function mount(levelId: string, progress: Progress = defaultProgress()) {
  return render(<PlayHarness levelId={levelId} progress={progress} />);
}

function editorText(): string {
  const content = document.querySelector<HTMLElement>(".cm-content");
  expect(content, "the CodeMirror editor should be mounted").toBeTruthy();
  return content!.textContent ?? "";
}

async function dismissLesson(user: ReturnType<typeof userEvent.setup>) {
  const dismiss = screen.queryByText("To the yard");
  if (dismiss) await user.click(dismiss);
}

/**
 * Types into the editor by dispatching a real CodeMirror transaction on the mounted view —
 * the same path a keystroke takes (doc change → updateListener → onChange → draft saved).
 * jsdom has no text-input pipeline, so synthetic key/DOM events never reach CodeMirror.
 */
function typeIntoEditor(insertion: string): void {
  const host = document.querySelector<HTMLElement>("[data-editor-host]")!;
  const view = EditorView.findFromDOM(host.querySelector(".cm-editor")!);
  expect(view, "the CodeMirror view should be reachable").toBeTruthy();
  act(() => {
    view!.dispatch({
      changes: { from: view!.state.doc.length, insert: insertion },
    });
  });
}

/** Let CssEditor's deferred doc reports (macrotask timers) fire. */
async function settleEditorReports(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5));
  });
}

/** The solution for `levelId`, seeded as a draft — the same path a returning player takes. */
function withSolutionDraft(levelId: string, base: Progress = defaultProgress()): Progress {
  return {
    ...base,
    drafts: { ...base.drafts, [levelId]: getLevel(levelId)!.solutionCSS },
  };
}

beforeEach(() => {
  setViewport(1400, 900);
});

describe("play screen", () => {
  it("shows the brief, both docks, and the starter CSS", async () => {
    const user = userEvent.setup();
    mount("c1-01");
    await dismissLesson(user);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("1. Planks in Parallel");
    expect(screen.getByText("Captain Wren")).toBeTruthy();
    expect(screen.getByText("Your dock")).toBeTruthy();
    expect(screen.getByText("Goal dock")).toBeTruthy();
    expect(editorText()).toContain(".harbor");
    expect(editorText()).not.toContain("grid-template-columns");
  });

  it("shows the chapter lesson for unseen shifts and skips seen ones", async () => {
    const user = userEvent.setup();
    const fresh = mount("c1-01");
    expect(screen.getByText("To the yard")).toBeTruthy();
    await user.click(screen.getByText("To the yard"));
    fresh.unmount();

    const seen = { ...defaultProgress(), seenLessons: [1] };
    mount("c1-01", seen);
    expect(screen.queryByText("To the yard")).toBeNull();
  });

  it("keeps the editor document in sync when the level changes", () => {
    const view = mount("c1-01");
    expect(editorText()).toContain(".harbor");

    view.rerender(<PlayHarness levelId="c1-02" progress={defaultProgress()} />);
    expect(editorText()).toContain("display: grid");
  });

  it("never reverts in-flight local edits when commits lag the doc (typing race)", async () => {
    const reported: string[] = [];
    const start = getLevel("c1-01")!.starterCSS;
    const make = (value: string) => (
      <CssEditor value={value} onChange={(next) => reported.push(next)} onRun={() => {}} />
    );
    const { rerender } = render(make(start));
    const cm = () => EditorView.findFromDOM(document.querySelector("[data-editor-host]")!.querySelector(".cm-editor")!)!;
    // Deferred reports (see CssEditor) run on a macrotask; flush them like a real event loop.
    const settle = async () => {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
      });
    };

    // The player types; the editor reports v2 but the parent has not committed it yet.
    const v2 = `${start}display: grid;`;
    act(() => cm().dispatch({ changes: { from: cm().state.doc.length, insert: "display: grid;" } }));
    await settle();
    expect(reported.at(-1)).toBe(v2);

    // More typing lands while the parent is still catching up; the parent then commits the
    // last reported value — exactly what a lagging passive-effect flush looks like. The doc
    // (already further ahead) must survive.
    act(() => cm().dispatch({ changes: { from: cm().state.doc.length, insert: "\n  grid-template-columns: 1fr 1fr;\n" } }));
    rerender(make(v2));
    expect(cm().state.doc.toString()).not.toBe(v2);

    // The burst reports, the parent catches up fully, and everything settles.
    await settle();
    const v3 = cm().state.doc.toString();
    rerender(make(v3));
    expect(cm().state.doc.toString()).toBe(v3);

    // A never-emitted value still applies from outside (Reset, level switch, draft restore).
    const external = ".harbor { color: gold }";
    rerender(make(external));
    expect(cm().state.doc.toString()).toBe(external);
  });

  it("still applies back-to-back external value changes to the document", () => {
    const start = getLevel("c1-01")!.starterCSS;
    const { rerender } = render(<CssEditor value={start} onChange={() => {}} onRun={() => {}} />);
    const cm = () => EditorView.findFromDOM(document.querySelector("[data-editor-host]")!.querySelector(".cm-editor")!)!;

    const first = ".harbor { color: red }";
    rerender(<CssEditor value={first} onChange={() => {}} onRun={() => {}} />);
    expect(cm().state.doc.toString()).toBe(first);

    const second = ".harbor { color: blue }";
    rerender(<CssEditor value={second} onChange={() => {}} onRun={() => {}} />);
    expect(cm().state.doc.toString()).toBe(second);
  });

  it("Reset replaces the document even after the player has typed", async () => {
    const user = userEvent.setup();
    mount("c1-01");
    await dismissLesson(user);

    act(() => {
      const cm = EditorView.findFromDOM(
        document.querySelector("[data-editor-host]")!.querySelector(".cm-editor")!,
      )!;
      cm.dispatch({ changes: { from: cm.state.doc.length, insert: "display: grid;" } });
    });
    expect(editorText()).toContain("display: grid;");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(editorText()).not.toContain("display: grid;");
    expect(editorText()).toContain(".harbor");
  });

  it("Reset restores the starter CSS", async () => {
    const user = userEvent.setup();
    const messy = defaultProgress();
    messy.drafts = { "c1-01": ".harbor { display: flex; justify-content: end }" };
    mount("c1-01", messy);
    expect(editorText()).toContain("flex");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(editorText()).not.toContain("flex");
    expect(editorText()).toContain(".harbor");
  });

  it("saves a draft as the player types, and the draft survives leaving and returning", async () => {
    const user = userEvent.setup();
    const view = mount("c1-01");
    await dismissLesson(user);

    typeIntoEditor("display: none;");
    expect(editorText()).toContain("display: none;");
    await settleEditorReports();

    view.rerender(<PlayHarness levelId="c1-02" progress={defaultProgress()} />);
    expect(editorText()).toContain("grid");

    view.rerender(<PlayHarness levelId="c1-01" progress={defaultProgress()} />);
    expect(editorText()).toContain("display: none;");
  });

  it("Check dock names the missing tool on a berth that mandates one", async () => {
    const user = userEvent.setup();
    mount("c1-03");
    await dismissLesson(user);

    await user.click(screen.getByRole("button", { name: "Check dock" }));
    const status = document.querySelector(".fail-list");
    expect(status, "failure messages should be listed").toBeTruthy();
    expect(status!.textContent).toContain("repeat(");
  });

  it("Mod+Enter inside the editor runs the check", async () => {
    const user = userEvent.setup();
    mount("c1-03");
    await dismissLesson(user);

    const content = document.querySelector<HTMLElement>(".cm-content")!;
    content.focus();
    fireEvent.keyDown(content, { key: "Enter", ctrlKey: true, metaKey: false });

    expect(screen.getByRole("status").textContent).toContain("repeat(");
  });

  it("Escape inside the editor hands focus back to the page", async () => {
    const user = userEvent.setup();
    mount("c1-01");
    await dismissLesson(user);

    const content = document.querySelector<HTMLElement>(".cm-content")!;
    content.focus();
    expect(document.activeElement).toBe(content);
    fireEvent.keyDown(content, { key: "Escape" });
    expect(document.activeElement).not.toBe(content);
  });

  it("the reference solution passes the check, clears the berth, and records it", async () => {
    const user = userEvent.setup();
    const latest: { current: Progress | null } = { current: null };
    render(
      <PlayHarness
        levelId="c1-01"
        progress={withSolutionDraft("c1-01")}
        onProgressPatch={(next) => (latest.current = next)}
      />,
    );
    await dismissLesson(user);

    await user.click(screen.getByRole("button", { name: "Check dock" }));
    expect(screen.getByText("Berth cleared")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Planks in Parallel" })).toBeTruthy();
    expect(latest.current?.completed).toContain("c1-01");
  });

  it("clearing a shift's last berth awards the badge", async () => {
    const user = userEvent.setup();
    const nearlyDone = defaultProgress();
    nearlyDone.completed = levels.filter((l) => l.chapter === 1 && l.order < 10).map((l) => l.id);
    const latest: { current: Progress | null } = { current: null };
    const props = {
      levelId: "c1-10",
      progress: withSolutionDraft("c1-10", nearlyDone),
      onProgressPatch: (next: Progress) => (latest.current = next),
    };
    render(<PlayHarness {...props} />);
    await dismissLesson(user);

    await user.click(screen.getByRole("button", { name: "Check dock" }));
    expect(screen.getByText("Berth cleared")).toBeTruthy();
    expect(latest.current?.badges).toContain(1);
    expect(latest.current).not.toHaveProperty("unlockedChapter");
  });

  it("escalates hints one rung at a time and stops at three", async () => {
    const user = userEvent.setup();
    mount("c1-01");
    await dismissLesson(user);

    await user.click(screen.getByRole("button", { name: "Hint 0/3" }));
    const ladder = document.querySelector(".hint-list");
    expect(ladder?.textContent).toContain("display into a grid");

    await user.click(screen.getByRole("button", { name: "Hint 1/3" }));
    await user.click(screen.getByRole("button", { name: "Hint 2/3" }));
    expect(document.querySelectorAll(".hint-list li")).toHaveLength(3);
    expect(document.querySelector(".hint-list")!.textContent).toContain("1fr 1fr 1fr");
    expect(
      (screen.getByRole("button", { name: "Hint 3/3" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("reveals the useful tool without the values", async () => {
    const user = userEvent.setup();
    mount("c1-01");
    await dismissLesson(user);

    await user.click(screen.getByRole("button", { name: "Useful tool" }));
    const reveal = screen.getByText(/The plan turns on/);
    const names = [...reveal.querySelectorAll("code")].map((el) => el.textContent);
    expect(names).toEqual(["display", "grid-template-columns"]);
    expect(reveal.textContent).not.toContain("1fr");

    await user.click(screen.getByRole("button", { name: "Hide useful tool" }));
    expect(screen.queryByText(/The plan turns on/)).toBeNull();
  });

  it("pane defaults: both docks on wide screens, the player's dock on phones", () => {
    setViewport(1400, 900);
    const wide = mount("c1-01");
    for (const slot of wide.container.querySelectorAll(".preview-slot")) {
      expect(slot.className, "wide viewport shows both docks").not.toContain("is-offscreen");
    }
    wide.unmount();

    setViewport(390, 844);
    const narrow = mount("c1-01");
    const slots = [...narrow.container.querySelectorAll(".preview-slot")];
    const yours = slots.find((s) => !s.className.includes("is-offscreen"));
    const goal = slots.find((s) => s.className.includes("is-offscreen"));
    expect(yours?.querySelector("#player-dock")).toBeTruthy();
    expect(goal?.querySelector("#goal-dock")).toBeTruthy();
    expect(goal?.getAttribute("aria-hidden")).toBe("true");
  });

  it("an explicit Yours/Goal/Both choice wins over the viewport default", async () => {
    const user = userEvent.setup();
    setViewport(390, 844);
    const view = mount("c1-01");
    await dismissLesson(user);

    await user.click(screen.getByRole("tab", { name: "Goal" }));
    const slots = [...view.container.querySelectorAll(".preview-slot")];
    expect(slots.find((s) => s.querySelector("#goal-dock"))?.className).not.toContain(
      "is-offscreen",
    );
    expect(slots.find((s) => s.querySelector("#player-dock"))?.className).toContain(
      "is-offscreen",
    );
  });

  it("expands a dock full screen, switches, and closes", async () => {
    const user = userEvent.setup();
    mount("c1-01");
    await dismissLesson(user);

    await user.click(screen.getAllByRole("button", { name: "Expand" })[0]);
    const dialog = screen.getByRole("dialog", { name: "Your dock, expanded" });
    expect(within(dialog).getByRole("button", { name: "Show goal" })).toBeTruthy();

    await user.click(within(dialog).getByRole("button", { name: "Show goal" }));
    expect(screen.getByRole("dialog", { name: "Goal dock, expanded" })).toBeTruthy();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("overlay toggles persist through the progress patch", async () => {
    const user = userEvent.setup();
    const latest: { current: Progress | null } = { current: null };
    const props = {
      levelId: "c1-01",
      progress: defaultProgress(),
      onProgressPatch: (next: Progress) => (latest.current = next),
    };
    const view = render(<PlayHarness {...props} />);
    await dismissLesson(user);

    const lines = view.container.querySelector<HTMLInputElement>(
      '.overlay-toggles input[type="checkbox"]',
    )!;
    await user.click(lines);
    expect(latest.current?.overlay.lines).toBe(false);
  });
});

describe("harbor glossary", () => {
  it("searches live, reports the match count, and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<HarborGlossary onClose={() => {}} />);

    expect(screen.getByRole("status").textContent).not.toContain("sealed");
    await user.type(screen.getByLabelText(/Search terms/), "repeat");
    const count = screen.getByRole("status").textContent!;
    expect(count).toMatch(/^\d+ of 22 entries$/);
    const [matching] = count.split(" of ").map((n) => parseInt(n, 10));
    expect(matching).toBeLessThan(22);

    const search = screen.getByLabelText(/Search terms/);
    await user.clear(search);
    await user.type(search, "zzzz-no-such-term");
    expect(screen.getByText(/No entry answers to/)).toBeTruthy();
  });

  it("shows the full reference regardless of campaign position", () => {
    render(<HarborGlossary onClose={() => {}} />);
    expect(screen.getByRole("status").textContent).toBe("22 of 22 entries");
  });

  it("closes from the header", async () => {
    const user = userEvent.setup();
    let closed = false;
    render(<HarborGlossary onClose={() => (closed = true)} />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(closed).toBe(true);
  });
});

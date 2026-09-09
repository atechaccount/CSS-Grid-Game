import { useEffect, useMemo, useRef, useState } from "react";
import { art } from "../assets/art";
import { chapters } from "../data/chapters";
import { getNextLevel, levelsForChapter } from "../data/levels";
import { usefulToolsForLevel } from "../engine/level-tools";
import { checkLevel } from "../engine/validate";
import type { Level, Progress } from "../types";
import { useMediaQuery } from "../utils/useMediaQuery";
import { CssEditor } from "./CssEditor";
import { GridPreview } from "./GridPreview";
import { HarborGlossary } from "./HarborGlossary";

/** Which dock preview is on screen: one at a time, or both for side-by-side comparison. */
type PaneMode = "yours" | "goal" | "both";

export function PlayScreen({
  level,
  progress,
  onProgress,
  onMap,
  onGoto,
  onWinGame,
}: {
  level: Level;
  progress: Progress;
  onProgress: (next: Progress) => void;
  onMap: () => void;
  onGoto: (id: string) => void;
  onWinGame: () => void;
}) {
  const chapter = chapters.find((c) => c.id === level.chapter)!;
  const chapterLevels = levelsForChapter(level.chapter);
  const playerRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const [css, setCss] = useState(progress.drafts[level.id] ?? level.starterCSS);
  const [hintStep, setHintStep] = useState(progress.hintsUsed[level.id] ?? 0);
  const [messages, setMessages] = useState<string[]>([]);
  const [passed, setPassed] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showLesson, setShowLesson] = useState(!progress.seenLessons.includes(level.chapter));
  const [showSheet, setShowSheet] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [paneChoice, setPaneChoice] = useState<PaneMode | null>(null);
  const [expanded, setExpanded] = useState<Exclude<PaneMode, "both"> | null>(null);
  const isWide = useMediaQuery("(min-width: 981px)");
  // An explicit Yours/Goal/Both choice always wins; otherwise wide viewports get both docks and
  // narrow ones get the player's own dock, because two docks side by side stop being readable.
  const pane: PaneMode = paneChoice ?? (isWide ? "both" : "yours");
  const already = progress.completed.includes(level.id);
  const usefulTools = useMemo(() => usefulToolsForLevel(level), [level]);

  useEffect(() => {
    setCss(progress.drafts[level.id] ?? level.starterCSS);
    setHintStep(progress.hintsUsed[level.id] ?? 0);
    setMessages([]);
    setPassed(false);
    setShowSolution(false);
    setShowTools(false);
    setExpanded(null);
    setShowLesson(!progress.seenLessons.includes(level.chapter));
  }, [level.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runCheck();
      }
      if (e.key === "Escape") {
        setShowLesson(false);
        setShowSheet(false);
        setExpanded(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const overlay = progress.overlay;
  const narratorSrc = level.narrator === "pip" ? art.pip : art.captainWren;
  const narratorName = level.narrator === "pip" ? "Pip, junior rigger" : "Captain Wren";
  const singlePane = pane !== "both";

  const patch = (partial: Partial<Progress>) => {
    onProgress({ ...progress, ...partial });
  };

  const updateCss = (next: string) => {
    setCss(next);
    patch({
      drafts: { ...progress.drafts, [level.id]: next },
      lastLevelId: level.id,
    });
  };

  const runCheck = () => {
    const playerRoot = playerRef.current;
    const goalRoot = goalRef.current;
    if (!playerRoot || !goalRoot) return;
    const result = checkLevel(level, css, playerRoot, goalRoot);
    if (result.ok) {
      setPassed(true);
      setMessages([]);
      const completed = progress.completed.includes(level.id)
        ? progress.completed
        : [...progress.completed, level.id];
      const chapterDone = chapterLevels.every((l) => completed.includes(l.id));
      const badges = chapterDone && !progress.badges.includes(chapter.id)
        ? [...progress.badges, chapter.id]
        : progress.badges;
      patch({ completed, badges, lastLevelId: level.id });
    } else {
      setPassed(false);
      setMessages(result.messages);
    }
  };

  const useHint = () => {
    const next = Math.min(3, hintStep + 1);
    setHintStep(next);
    patch({ hintsUsed: { ...progress.hintsUsed, [level.id]: next } });
  };

  const reveal = () => {
    setShowSolution(true);
    patch({
      solutionsRevealed: progress.solutionsRevealed.includes(level.id)
        ? progress.solutionsRevealed
        : [...progress.solutionsRevealed, level.id],
    });
  };

  const dismissLesson = () => {
    setShowLesson(false);
    if (!progress.seenLessons.includes(level.chapter)) {
      patch({ seenLessons: [...progress.seenLessons, level.chapter] });
    }
  };

  const goNext = () => {
    if (level.id === "c10-08") {
      onWinGame();
      return;
    }
    const nxt = getNextLevel(level.id);
    if (!nxt) {
      onMap();
      return;
    }
    onGoto(nxt.id);
  };

  const nextLabel = useMemo(() => {
    if (level.id === "c10-08") return "Open the harbor";
    const nxt = getNextLevel(level.id);
    if (!nxt) return "Harbor chart";
    if (nxt.chapter !== level.chapter) return "Next shift";
    return "Next berth";
  }, [level.id]);

  return (
    <div className="play-screen">
      <header className="play-top">
        <button type="button" className="btn-ghost" onClick={onMap}>
          Chart
        </button>
        <div className="play-titles">
          <p>
            {chapter.shift} · {chapter.setting}
          </p>
          <h1>
            {level.order}. {level.title}
          </h1>
        </div>
        <label className="play-jump">
          <span>Berth</span>
          <select
            value={level.id}
            onChange={(e) => onGoto(e.target.value)}
            aria-label="Jump to level"
          >
            {chapterLevels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.order}. {l.title}
                {progress.completed.includes(l.id) ? " ✓" : ""}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn-ghost" onClick={() => setShowSheet(true)}>
          Glossary
        </button>
        <button type="button" className="btn-ghost" onClick={() => setShowLesson(true)}>
          Lesson
        </button>
      </header>

      <aside className="play-brief">
        <div className="brief-card">
          <div className="narrator">
            <img src={narratorSrc} alt="" />
            <div>
              <p className="narrator-name">{narratorName}</p>
              <p className="narrator-tag">{level.difficulty}</p>
            </div>
          </div>
          <p className="brief-story">{level.story}</p>
          <div className="brief-goal">
            <h2>Goal</h2>
            <p>{level.objective}</p>
            <div className="brief-tools">
              <button
                type="button"
                className="btn-ghost tool-toggle"
                aria-expanded={showTools}
                onClick={() => setShowTools((on) => !on)}
              >
                {showTools ? "Hide useful tool" : "Useful tool"}
              </button>
              {showTools ? (
                <p className="tool-reveal">
                  {usefulTools.length > 0 ? (
                    <>
                      The plan turns on{" "}
                      {usefulTools.map((tool, i) => (
                        <span key={tool}>
                          {i > 0 ? " and " : ""}
                          <code>{tool}</code>
                        </span>
                      ))}
                      . No values — that part is still yours.
                    </>
                  ) : (
                    <>
                      Everything you need is already in the starter CSS. This berth is about
                      changing what is there.
                    </>
                  )}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="editor-card">
          <div className="editor-card-head">
            <span className="editor-card-label">Harbor CSS</span>
            <span className="editor-card-keys">Ctrl/Cmd + Enter checks · Esc releases the keyboard</span>
          </div>
          <CssEditor value={css} onChange={updateCss} onRun={runCheck} />
          <div className="editor-actions">
            <button type="button" className="btn-brass" onClick={runCheck}>
              Check dock
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => updateCss(level.starterCSS)}
            >
              Reset
            </button>
            <button type="button" className="btn-ghost" onClick={useHint} disabled={hintStep >= 3}>
              Hint {hintStep}/3
            </button>
            <button type="button" className="btn-ghost" onClick={reveal}>
              Reveal
            </button>
          </div>
          {hintStep > 0 ? (
            <ol className="hint-list">
              {level.hints.slice(0, hintStep).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          ) : null}
          {messages.length > 0 && !passed ? (
            <ul className="fail-list" role="status">
              {messages.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          ) : null}
          {showSolution ? (
            <div className="solution-box">
              <h3>Reference CSS</h3>
              <pre>
                <code>{level.solutionCSS}</code>
              </pre>
              <p>{level.explanation}</p>
            </div>
          ) : null}
        </div>
      </aside>

      <section className="play-stage">
        <div className="stage-tools">
          <div className="pane-toggle" role="tablist" aria-label="Which dock to show">
            {(["yours", "goal", "both"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={pane === mode}
                className={pane === mode ? "is-on" : ""}
                onClick={() => setPaneChoice(mode)}
              >
                {mode === "yours" ? "Yours" : mode === "goal" ? "Goal" : "Both"}
              </button>
            ))}
          </div>
          <div className="overlay-toggles">
            <label>
              <input
                type="checkbox"
                checked={overlay.lines}
                onChange={(e) =>
                  patch({ overlay: { ...overlay, lines: e.target.checked } })
                }
              />
              Lines
            </label>
            <label>
              <input
                type="checkbox"
                checked={overlay.numbers}
                onChange={(e) =>
                  patch({ overlay: { ...overlay, numbers: e.target.checked } })
                }
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                checked={overlay.labels}
                onChange={(e) =>
                  patch({ overlay: { ...overlay, labels: e.target.checked } })
                }
              />
              Labels
            </label>
          </div>
        </div>
        {/*
          Both docks stay mounted at the same width even when only one is on screen:
          validation measures the hidden dock too, so it must be laid out, never display: none.
        */}
        <div className={`stage-panes ${singlePane ? "is-single" : "is-both"}`}>
          <div
            className={`preview-slot ${singlePane && pane !== "yours" ? "is-offscreen" : ""}`}
            aria-hidden={singlePane && pane !== "yours"}
          >
            <GridPreview
              id="player-dock"
              title="Your dock"
              caption="Live preview of your CSS"
              css={css}
              level={level}
              overlay={overlay}
              rootRef={playerRef}
              onExpand={() => setExpanded("yours")}
            />
          </div>
          <div
            className={`preview-slot ${singlePane && pane !== "goal" ? "is-offscreen" : ""}`}
            aria-hidden={singlePane && pane !== "goal"}
          >
            <GridPreview
              id="goal-dock"
              title="Goal dock"
              caption="Match this berth plan"
              css={level.solutionCSS}
              level={level}
              overlay={overlay}
              rootRef={goalRef}
              onExpand={() => setExpanded("goal")}
            />
          </div>
        </div>
        <p className="stage-concepts">
          {level.concepts.join(" · ")}
          {already ? " · cleared" : ""}
        </p>
      </section>

      {expanded ? (
        <div
          className="preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={expanded === "yours" ? "Your dock, expanded" : "Goal dock, expanded"}
        >
          <div className="preview-overlay-bar">
            <p className="map-kicker">{expanded === "yours" ? "Your dock" : "Goal dock"}</p>
            <div className="preview-overlay-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setExpanded(expanded === "yours" ? "goal" : "yours")}
              >
                {expanded === "yours" ? "Show goal" : "Show yours"}
              </button>
              <button type="button" className="btn-brass" onClick={() => setExpanded(null)}>
                Close
              </button>
            </div>
          </div>
          <div className="preview-overlay-stage">
            <GridPreview
              id={expanded === "yours" ? "player-dock-expanded" : "goal-dock-expanded"}
              title={expanded === "yours" ? "Your dock" : "Goal dock"}
              caption={expanded === "yours" ? "Live preview of your CSS" : "Match this berth plan"}
              css={expanded === "yours" ? css : level.solutionCSS}
              level={level}
              overlay={overlay}
              boardWidth={680}
            />
          </div>
        </div>
      ) : null}

      {passed ? (
        <div className="modal-backdrop" role="dialog" aria-labelledby="pass-title" aria-modal="true">
          <div className="modal-card">
            <p className="map-kicker">Berth cleared</p>
            <h2 id="pass-title">{level.title}</h2>
            <p className="modal-why">{level.whyItWorked}</p>
            <p className="modal-exp">{level.explanation}</p>
            <p className="modal-real">
              <strong>In a real UI: </strong>
              {level.realWorld}
            </p>
            <div className="title-actions">
              <button type="button" className="btn-brass" onClick={goNext}>
                {nextLabel}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setPassed(false)}>
                Keep editing
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showLesson ? (
        <div className="modal-backdrop" role="dialog" aria-labelledby="lesson-title" aria-modal="true">
          <div className="modal-card lesson-card">
            <p className="map-kicker">{chapter.shift}</p>
            <h2 id="lesson-title">{chapter.lessonTitle}</h2>
            {chapter.lesson.split("\n\n").map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
            <h3>When you’d use this</h3>
            <p>{chapter.realWorld}</p>
            <h3>Common mistakes</h3>
            <ul>
              {chapter.mistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <button type="button" className="btn-brass" onClick={dismissLesson}>
              To the yard
            </button>
          </div>
        </div>
      ) : null}

      {showSheet ? <HarborGlossary onClose={() => setShowSheet(false)} /> : null}
    </div>
  );
}

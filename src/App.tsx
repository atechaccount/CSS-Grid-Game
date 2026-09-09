import { useEffect, useMemo, useState } from "react";
import { art } from "./assets/art";
import { ChapterMap } from "./components/ChapterMap";
import { PlayScreen } from "./components/PlayScreen";
import { TitleScreen } from "./components/TitleScreen";
import { firstIncomplete, firstLevelOf, getLevel, levels } from "./data/levels";
import { loadProgress, resetProgress, saveProgress } from "./store/progress";
import type { Progress } from "./types";

type Screen = "title" | "map" | "play" | "howto" | "victory";

/**
 * Query-string boot overrides, read once per page load. Every shift and berth is always open,
 * so the old `?unlock=all` param is accepted but no longer changes anything.
 * `?level=<id>` jumps straight into one berth.
 */
function bootFromQuery(): { progress: Progress; levelId: string | null } {
  const params = new URLSearchParams(window.location.search);
  let progress = loadProgress();
  let levelId: string | null = null;
  const requested = params.get("level");
  const requestedLevel = requested ? getLevel(requested) : undefined;
  if (requestedLevel) {
    levelId = requestedLevel.id;
    progress = {
      ...progress,
      lastLevelId: requestedLevel.id,
      seenTitle: true,
    };
  }
  return { progress, levelId };
}

export default function App() {
  const boot = useMemo(bootFromQuery, []);
  const [progress, setProgress] = useState<Progress>(boot.progress);
  const [screen, setScreen] = useState<Screen>(boot.levelId ? "play" : "title");
  const [levelId, setLevelId] = useState<string>(
    boot.levelId ??
      (progress.lastLevelId && getLevel(progress.lastLevelId)
        ? progress.lastLevelId
        : levels[0].id),
  );

  // Persist boot overrides once so `?unlock=all` and `?level=` survive a reload without the param.
  useEffect(() => {
    saveProgress(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const level = useMemo(() => getLevel(levelId) ?? levels[0], [levelId]);

  const commit = (next: Progress) => {
    setProgress(next);
    saveProgress(next);
  };

  const openLevel = (id: string) => {
    setLevelId(id);
    commit({ ...progress, lastLevelId: id, seenTitle: true });
    setScreen("play");
  };

  if (screen === "title") {
    return (
      <TitleScreen
        progress={progress}
        onHowTo={() => setScreen("howto")}
        onContinue={() => {
          const next = firstIncomplete(progress.completed);
          openLevel(progress.lastLevelId && getLevel(progress.lastLevelId) ? progress.lastLevelId : next.id);
        }}
        onStart={() => {
          const next = {
            ...resetProgress(),
            lastLevelId: levels[0].id,
            seenTitle: true,
          };
          commit(next);
          setLevelId(levels[0].id);
          setScreen("play");
        }}
      />
    );
  }

  if (screen === "howto") {
    return <HowTo onBack={() => setScreen("title")} />;
  }

  if (screen === "map") {
    return (
      <ChapterMap
        progress={progress}
        onTitle={() => setScreen("title")}
        onOpen={(ch) => {
          const first = firstLevelOf(ch);
          if (!first) return;
          const chapterLevels = levels.filter((l) => l.chapter === ch);
          const nextInChapter =
            chapterLevels.find((l) => !progress.completed.includes(l.id)) ?? first;
          openLevel(nextInChapter.id);
        }}
        onOpenLevel={(id) => openLevel(id)}
        onDrill={() => {
          const pool = progress.completed;
          if (!pool.length) return;
          const id = pool[Math.floor(Math.random() * pool.length)];
          openLevel(id);
        }}
      />
    );
  }

  if (screen === "victory") {
    return <Victory onMap={() => setScreen("map")} onTitle={() => setScreen("title")} />;
  }

  return (
    <PlayScreen
      level={level}
      progress={progress}
      onProgress={commit}
      onMap={() => setScreen("map")}
      onGoto={openLevel}
      onWinGame={() => setScreen("victory")}
    />
  );
}

function HowTo({ onBack }: { onBack: () => void }) {
  return (
    <main className="howto-screen">
      <div className="modal-card lesson-card">
        <p className="map-kicker">Standing orders</p>
        <h1>How the watch works</h1>
        <ol className="howto-list">
          <li>
            Read the goal in plain language, then compare <strong>Your dock</strong> to the{" "}
            <strong>Goal dock</strong>.
          </li>
          <li>
            Write real CSS in the editor. The live preview updates as you type. Tab indents two
            spaces, Shift+Tab outdents, Ctrl/Cmd+Z undoes, and Ctrl/Cmd+Enter runs a check. Press
            Esc inside the editor to hand the keyboard back to the page.
          </li>
          <li>
            Check dock compares layout, not a single exact string — equivalent CSS (for example{" "}
            <code>1fr 1fr 1fr</code> vs <code>repeat(3, 1fr)</code>) can pass unless the berth
            asks for a specific function.
          </li>
          <li>
            Hints escalate: a nudge, then the likely tool, then the shape of the syntax. The
            optional <strong>Useful tool</strong> button under the goal names the property without
            the value.
          </li>
          <li>
            On a narrow screen, switch between Your dock and the Goal dock, or expand either one
            full screen. Every shift and berth stays open — the chart is a menu, not a gate — and
            the full glossary is always available.
          </li>
        </ol>
        <p>
          Toggle lines and numbers on the dock when you need to count grid lines. They start at 1,
          and the end line is exclusive: <code>1 / 3</code> covers two tracks.
        </p>
        <button type="button" className="btn-brass" onClick={onBack}>
          Back to the gangway
        </button>
      </div>
    </main>
  );
}

function Victory({ onMap, onTitle }: { onMap: () => void; onTitle: () => void }) {
  return (
    <main className="title-screen victory-screen">
      <img
        className="title-bg"
        src={art.finaleConvoy}
        alt="The Autumn Convoy arriving at the restored floating harbor at dusk."
      />
      <div className="title-veil" />
      <div className="title-copy">
        <p className="title-kicker">Harbor open</p>
        <h1 className="title-mark">The lattice holds</h1>
        <p className="title-log">
          The Autumn Convoy berths without a scrape. Captain Wren does not smile often. She does
          tonight. You write Grid like a dock plan: tracks first, cargo second, leftover space on
          purpose.
        </p>
        <div className="title-actions">
          <button type="button" className="btn-brass" onClick={onMap}>
            Harbor chart
          </button>
          <button type="button" className="btn-ghost" onClick={onTitle}>
            Title
          </button>
        </div>
      </div>
    </main>
  );
}



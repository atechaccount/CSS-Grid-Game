import { art } from "../assets/art";
import { chapters } from "../data/chapters";
import { chapterComplete, levelsForChapter } from "../data/levels";
import type { Progress } from "../types";

export function ChapterMap({
  progress,
  onOpen,
  onTitle,
  onDrill,
}: {
  progress: Progress;
  onOpen: (chapter: number) => void;
  onTitle: () => void;
  onDrill: () => void;
}) {
  const doneCount = progress.completed.length;
  const drillReady = doneCount >= 8;

  return (
    <main className="map-screen">
      <img
        className="map-bg"
        src={art.harborChart}
        alt=""
        aria-hidden
      />
      <header className="map-top">
        <button type="button" className="btn-ghost" onClick={onTitle}>
          ← Logbook
        </button>
        <div>
          <p className="map-kicker">Harbor chart</p>
          <h1>Nimbus Reach — ten shifts</h1>
        </div>
        <p className="map-count">{doneCount} berths cleared</p>
      </header>

      <ol className="map-grid">
        {chapters.map((ch) => {
          const locked = ch.id > progress.unlockedChapter;
          const done = chapterComplete(ch.id, progress.completed);
          const levels = levelsForChapter(ch.id);
          const cleared = levels.filter((l) => progress.completed.includes(l.id)).length;
          return (
            <li key={ch.id}>
              <button
                type="button"
                className={`map-card ${locked ? "is-locked" : ""} ${done ? "is-done" : ""}`}
                disabled={locked}
                onClick={() => onOpen(ch.id)}
              >
                <span className="map-shift">{ch.shift}</span>
                <strong>{ch.title}</strong>
                <em>{ch.setting}</em>
                <p>{ch.blurb}</p>
                <span className="map-meta">
                  {locked
                    ? "Sealed until the previous shift is cleared"
                    : done
                      ? "Shift complete"
                      : `${cleared} / ${levels.length} levels`}
                </span>
                {done ? <span className="map-badge">Badge</span> : null}
              </button>
            </li>
          );
        })}
      </ol>

      <footer className="map-foot">
        <p>
          Complete a shift’s last berth to unseal the next. Replay anything you’ve already
          cleared.
        </p>
        {drillReady ? (
          <button type="button" className="btn-brass" onClick={onDrill}>
            Rerig drill
          </button>
        ) : (
          <p className="map-drill-hint">Rerig drills unlock after 8 cleared berths.</p>
        )}
      </footer>
    </main>
  );
}

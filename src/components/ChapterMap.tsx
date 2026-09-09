import { art } from "../assets/art";
import { chapters } from "../data/chapters";
import { chapterComplete, levelsForChapter } from "../data/levels";
import type { Progress } from "../types";

export function ChapterMap({
  progress,
  onOpen,
  onOpenLevel,
  onTitle,
  onDrill,
}: {
  progress: Progress;
  onOpen: (chapter: number) => void;
  onOpenLevel: (levelId: string) => void;
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
          const done = chapterComplete(ch.id, progress.completed);
          const levels = levelsForChapter(ch.id);
          const cleared = levels.filter((l) => progress.completed.includes(l.id)).length;
          return (
            <li key={ch.id}>
              <div className={`map-card ${done ? "is-done" : ""}`}>
                <button
                  type="button"
                  className="map-card-open"
                  onClick={() => onOpen(ch.id)}
                  aria-label={`Open ${ch.title}: ${done ? "shift complete" : `${cleared} of ${levels.length} levels cleared`}`}
                >
                  <span className="map-shift">{ch.shift}</span>
                  <strong>{ch.title}</strong>
                  <em>{ch.setting}</em>
                  <p>{ch.blurb}</p>
                  <span className="map-meta">
                    {done ? "Shift complete" : `${cleared} / ${levels.length} levels`}
                  </span>
                  {done ? <span className="map-badge">Badge</span> : null}
                </button>
                {/*
                  Every berth is one click from the chart: the campaign is a menu, not a gate.
                  Pills keep the chapter card click as the convenient default (next uncleared).
                */}
                <div className="map-levels" role="list" aria-label={`${ch.title} berths`}>
                  {levels.map((l) => {
                    const clearedLevel = progress.completed.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        role="listitem"
                        className={`map-level ${clearedLevel ? "is-cleared" : ""}`}
                        onClick={() => onOpenLevel(l.id)}
                        title={l.title}
                        aria-label={`Berth ${l.order}: ${l.title}${clearedLevel ? " (cleared)" : ""}`}
                      >
                        {clearedLevel ? "✓" : l.order}
                      </button>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="map-foot">
        <p>
          Every shift and berth is open — pick any card, or a numbered berth on it. Cleared
          berths carry the check mark.
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

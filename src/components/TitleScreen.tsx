import { art } from "../assets/art";
import type { Progress } from "../types";

export function TitleScreen({
  progress,
  onStart,
  onContinue,
  onHowTo,
}: {
  progress: Progress;
  onStart: () => void;
  onContinue: () => void;
  onHowTo: () => void;
}) {
  const hasSave = progress.completed.length > 0 || progress.lastLevelId;
  return (
    <main className="title-screen">
      <img
        className="title-bg"
        src={art.titleHarbor}
        alt="Floating sky harbor of Nimbus Reach at golden hour, airships moored at brass docks among clouds."
      />
      <div className="title-veil" />
      <div className="title-copy">
        <p className="title-kicker">Nimbus Reach Harbor Authority</p>
        <h1 className="title-mark">Sky Dock</h1>
        <p className="title-sub">Harbor Lines — a CSS Grid campaign</p>
        <p className="title-log">
          The Squall of Forty Winds sheared the docking lattice. You are the new Harbor
          Gridwright. Captain Wren wants the sky-lanes restored before the Autumn Convoy
          arrives. Write real CSS. Berth real ships.
        </p>
        <div className="title-actions">
          {hasSave ? (
            <button type="button" className="btn-brass" onClick={onContinue}>
              Resume watch
            </button>
          ) : null}
          <button
            type="button"
            className={hasSave ? "btn-ghost" : "btn-brass"}
            onClick={() => {
              if (
                hasSave &&
                !window.confirm("Start a new posting? This clears saved progress on this browser.")
              ) {
                return;
              }
              onStart();
            }}
          >
            {hasSave ? "New posting" : "Take the post"}
          </button>
          <button type="button" className="btn-ghost" onClick={onHowTo}>
            How the watch works
          </button>
        </div>
        <p className="title-hint">Write CSS. Check the dock. Trust the goal pane.</p>
      </div>
    </main>
  );
}

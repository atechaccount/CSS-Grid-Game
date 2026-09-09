import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { Level, OverlaySettings } from "../types";
import { parsePxTracks, sanitizeAndScope } from "../engine/css";
import { DockItem } from "./DockItem";

const BASE = `
.harbor {
  box-sizing: border-box;
  width: 100%;
  /* A minimum, not a fixed height: a ghost deck created by overflow grows the board instead of being clipped. */
  min-height: var(--dock-board-height, 260px);
  overflow: hidden;
  padding: 10px;
  background:
    linear-gradient(180deg, rgba(90, 155, 184, 0.28), rgba(30, 64, 82, 0.18)),
    repeating-linear-gradient(
      90deg,
      rgba(92, 64, 40, 0.18) 0 14px,
      rgba(72, 50, 32, 0.12) 14px 15px
    );
  border: 1px solid rgba(176, 141, 62, 0.35);
  box-shadow: inset 0 0 0 1px rgba(255, 247, 230, 0.08);
}
.unit {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  color: var(--unit-ink);
  background: var(--unit-fill);
  border: 1px solid rgba(20, 16, 10, 0.35);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.28),
    0 1px 2px rgba(0,0,0,0.18);
  overflow: hidden;
}
.harbor[data-item-style="token"] .unit {
  width: 72px;
  height: 72px;
  max-width: 100%;
  max-height: 100%;
}
.unit-face {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 3px 3px;
}
.unit-glyph {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  display: block;
}
.unit-glyph svg {
  width: 100%;
  height: 100%;
  display: block;
}
.unit-label {
  display: block;
  max-width: 100%;
  padding: 1px 5px;
  border-radius: 2px;
  background: rgba(247, 241, 230, 0.96);
  color: #1c2430;
  font-family: Outfit, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 650;
  line-height: 1.2;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;

interface OverlayState {
  cols: number[];
  rows: number[];
  gapX: number;
  gapY: number;
  padX: number;
  padY: number;
}

export function GridPreview({
  id,
  title,
  css,
  level,
  overlay,
  caption,
  rootRef,
  onExpand,
  boardWidth,
}: {
  id: string;
  title: string;
  css: string;
  level: Level;
  overlay: OverlaySettings;
  caption?: string;
  rootRef?: RefObject<HTMLDivElement | null>;
  /** Opens this dock in the full-screen compare overlay. Omitted when already expanded. */
  onExpand?: () => void;
  /** Widest the board may grow in px; the board shrinks below that to fit its pane. Default 360. */
  boardWidth?: number;
}) {
  const harborRef = useRef<HTMLDivElement>(null);
  const [tracks, setTracks] = useState<OverlayState | null>(null);
  const itemStyle = level.itemStyle ?? "fill";
  const height = level.boardHeight ?? 260;
  const scoped = sanitizeAndScope(css, id);
  const rootStyle = {
    "--dock-board-height": `${height}px`,
    ...(boardWidth ? { "--dock-board-size": `${boardWidth}px` } : null),
  } as CSSProperties;

  useEffect(() => {
    const el = harborRef.current;
    if (!el) return;
    const read = () => {
      const cs = getComputedStyle(el);
      if (cs.display !== "grid") {
        setTracks(null);
        return;
      }
      setTracks({
        cols: parsePxTracks(cs.gridTemplateColumns),
        rows: parsePxTracks(cs.gridTemplateRows),
        gapX: parseFloat(cs.columnGap) || 0,
        gapY: parseFloat(cs.rowGap) || 0,
        padX: parseFloat(cs.paddingLeft) || 0,
        padY: parseFloat(cs.paddingTop) || 0,
      });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    const t = window.setTimeout(read, 30);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [css, level.id, itemStyle]);

  return (
    <section className="preview-card" aria-label={title}>
      <header className="preview-head">
        <div className="preview-head-copy">
          <h3>{title}</h3>
          {caption ? <p>{caption}</p> : null}
        </div>
        {onExpand ? (
          <button type="button" className="btn-ghost preview-expand" onClick={onExpand}>
            Expand
          </button>
        ) : null}
      </header>
      <div className="preview-stage">
        <div id={id} className="preview-root" ref={rootRef} style={rootStyle}>
          <style>{`${BASE}\n${scoped}`}</style>
          <div
            ref={harborRef}
            className="harbor"
            data-item-style={itemStyle}
          >
            {level.items.map((item) => (
              <DockItem
                key={item.id}
                id={item.id}
                type={item.type}
                label={item.label}
                className={item.className ?? item.id}
                showLabel={overlay.labels}
              />
            ))}
          </div>
          {overlay.lines && tracks ? (
            <GridOverlay tracks={tracks} showNumbers={overlay.numbers} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function GridOverlay({
  tracks,
  showNumbers,
}: {
  tracks: OverlayState;
  showNumbers: boolean;
}) {
  const xs: number[] = [tracks.padX];
  let x = tracks.padX;
  tracks.cols.forEach((w, i) => {
    x += w;
    xs.push(x);
    if (i < tracks.cols.length - 1) {
      x += tracks.gapX;
    }
  });
  const ys: number[] = [tracks.padY];
  let y = tracks.padY;
  tracks.rows.forEach((h, i) => {
    y += h;
    ys.push(y);
    if (i < tracks.rows.length - 1) {
      y += tracks.gapY;
    }
  });

  return (
    <div className="grid-overlay" aria-hidden>
      {xs.map((left, i) => (
        <span key={`v${i}`} className="grid-line v" style={{ left }}>
          {showNumbers ? <em>{i + 1}</em> : null}
        </span>
      ))}
      {ys.map((top, i) => (
        <span key={`h${i}`} className="grid-line h" style={{ top }}>
          {showNumbers && i > 0 ? <em>{i + 1}</em> : null}
        </span>
      ))}
    </div>
  );
}

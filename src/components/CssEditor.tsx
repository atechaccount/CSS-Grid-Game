import { useEffect, useMemo, useRef } from "react";
import { escapeHtml, highlightCSS } from "../engine/css";

export function CssEditor({
  value,
  onChange,
  onRun,
}: {
  value: string;
  onChange: (next: string) => void;
  onRun: () => void;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const highlighted = useMemo(() => {
    try {
      return highlightCSS(value);
    } catch {
      return escapeHtml(value);
    }
  }, [value]);
  const lines = value.split("\n").length;
  const lineCount = Math.max(lines, 8);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const sync = () => {
      if (preRef.current) {
        preRef.current.scrollTop = ta.scrollTop;
        preRef.current.scrollLeft = ta.scrollLeft;
      }
      if (gutterRef.current) {
        gutterRef.current.scrollTop = ta.scrollTop;
      }
    };
    ta.addEventListener("scroll", sync);
    return () => ta.removeEventListener("scroll", sync);
  }, []);

  return (
    <div className="editor-shell">
      <div className="editor-gutter" aria-hidden ref={gutterRef}>
        {Array.from({ length: lineCount }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <div className="editor-pane">
        <pre
          ref={preRef}
          className="editor-highlight"
          aria-hidden
          dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
        />
        <textarea
          ref={taRef}
          id="css-editor"
          className="editor-input"
          value={value}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label="CSS editor"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              onRun();
            }
            if (e.key === "Tab") {
              e.preventDefault();
              const el = e.currentTarget;
              const start = el.selectionStart;
              const end = el.selectionEnd;
              const next = value.slice(0, start) + "  " + value.slice(end);
              onChange(next);
              requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = start + 2;
              });
            }
          }}
        />
      </div>
    </div>
  );
}

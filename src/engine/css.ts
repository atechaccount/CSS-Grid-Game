export function sanitizeAndScope(css: string, scopeId: string): string {
  const stripped = css
    .replace(/<\/style/gi, "")
    .replace(/<script/gi, "")
    .replace(/@import\b/gi, "@disabled-import")
    .replace(/expression\s*\(/gi, "none(")
    .replace(/javascript\s*:/gi, "none:");

  const opens = (stripped.match(/{/g) || []).length;
  const closes = (stripped.match(/}/g) || []).length;
  if (opens !== closes) {
    return `/* unbalanced braces — preview paused */`;
  }

  return `#${scopeId} {\n${stripped}\n}`;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlightCSS(code: string): string {
  const escaped = escapeHtml(code);
  const tokens: { start: number; end: number; cls: string }[] = [];

  const push = (re: RegExp, cls: string) => {
    const copy = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
    let m: RegExpExecArray | null;
    while ((m = copy.exec(escaped))) {
      const start = m.index;
      const end = start + m[0].length;
      const overlaps = tokens.some((t) => start < t.end && end > t.start);
      if (!overlaps) tokens.push({ start, end, cls });
    }
  };

  push(/\/\*[\s\S]*?\*\//g, "cm-cmt");
  push(/"[^"]*"|'[^']*'/g, "cm-str");
  push(/#[0-9a-fA-F]{3,8}\b/g, "cm-num");
  push(/\b\d+\.?\d*(px|fr|%|em|rem|vh|vw|ch|minmax|ms|s)?\b/g, "cm-num");
  push(/\b(repeat|minmax|min-content|max-content|fit-content|span|auto-fill|auto-fit)\b/g, "cm-fn");
  push(/[.#]?[a-zA-Z_-][\w-]*(?=\s*\{)/g, "cm-sel");
  push(/^\s*[a-zA-Z-]+(?=\s*:)/gm, "cm-prop");
  push(/\b(grid|none|auto|start|end|center|stretch|space-between|space-around|space-evenly|row|column|dense|inherit|initial|unset)\b/g, "cm-kw");

  tokens.sort((a, b) => a.start - b.start);

  let out = "";
  let cursor = 0;
  for (const t of tokens) {
    if (t.start < cursor) continue;
    out += escaped.slice(cursor, t.start);
    out += `<span class="${t.cls}">${escaped.slice(t.start, t.end)}</span>`;
    cursor = t.end;
  }
  out += escaped.slice(cursor);
  return out;
}

export function cssContains(css: string, needle: string): boolean {
  const n = needle.toLowerCase().replace(/\s+/g, "");
  const hay = css.toLowerCase().replace(/\s+/g, "");
  return hay.includes(n);
}

export function parsePxTracks(value: string): number[] {
  if (!value || value === "none") return [];
  const parts: number[] = [];
  const re = /([\d.]+)px/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value))) {
    parts.push(parseFloat(m[1]));
  }
  return parts;
}

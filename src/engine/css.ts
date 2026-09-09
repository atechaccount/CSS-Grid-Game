/**
 * Strips injection vectors, refuses unbalanced braces, and scopes a player's CSS to one dock
 * preview by wrapping it in a `#<scopeId> { ... }` native-nesting block.
 */
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

/** Whitespace-insensitive substring test, used for a level's requireCSS / forbidCSS needles. */
export function cssContains(css: string, needle: string): boolean {
  const n = needle.toLowerCase().replace(/\s+/g, "");
  const hay = css.toLowerCase().replace(/\s+/g, "");
  return hay.includes(n);
}

/** Parses a computed track list ("120px 1fr 60px") into its pixel track sizes, in order. */
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

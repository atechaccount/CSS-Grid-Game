import type { Level } from "../types";

/** Every property name declared in a CSS string, lower-cased and de-duplicated. */
function declaredPropertyNames(css: string): string[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const names: string[] = [];
  const propertyPattern = /([a-zA-Z-]+)\s*:/g;
  let match: RegExpExecArray | null;
  while ((match = propertyPattern.exec(withoutComments))) {
    names.push(match[1].toLowerCase());
  }
  return [...new Set(names)];
}

/**
 * The "useful tool" reveal: property names a berth's reference solution introduces that the
 * starter CSS does not already use. Property names only — never the values, so revealing them
 * points at the tool without giving away the answer.
 */
export function usefulToolsForLevel(level: Level): string[] {
  const starterProperties = new Set(declaredPropertyNames(level.starterCSS));
  return declaredPropertyNames(level.solutionCSS).filter((name) => !starterProperties.has(name));
}

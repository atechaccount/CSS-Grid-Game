import type { CheckResult, GridItem, Level, Rect } from "../types";
import { cssContains } from "./css";

const TOL = 6;

export function measureItems(root: HTMLElement): Rect[] {
  const harbor = root.querySelector(".harbor") as HTMLElement | null;
  if (!harbor) return [];
  const hr = harbor.getBoundingClientRect();
  return [...harbor.querySelectorAll<HTMLElement>("[data-unit]")].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      id: el.dataset.unit || "",
      x: r.left - hr.left,
      y: r.top - hr.top,
      w: r.width,
      h: r.height,
    };
  });
}

function near(a: number, b: number, tol = TOL): boolean {
  return Math.abs(a - b) <= tol;
}

function labelOf(items: GridItem[], id: string): string {
  return items.find((i) => i.id === id)?.label ?? id;
}

export function compareLayouts(
  player: Rect[],
  goal: Rect[],
  items: GridItem[],
): string[] {
  const messages: string[] = [];
  const goalMap = new Map(goal.map((r) => [r.id, r]));

  for (const p of player) {
    const g = goalMap.get(p.id);
    if (!g) continue;
    const name = labelOf(items, p.id);

    const posWrong = !near(p.x, g.x) || !near(p.y, g.y);
    const tooNarrow = p.w + TOL < g.w;
    const tooWide = p.w > g.w + TOL;
    const tooShort = p.h + TOL < g.h;
    const tooTall = p.h > g.h + TOL;

    if (tooNarrow) {
      messages.push(`${name} should span further across the dock.`);
    } else if (tooWide) {
      messages.push(`${name} spans too far horizontally.`);
    }
    if (tooShort) {
      messages.push(`${name} should cover more vertical berth.`);
    } else if (tooTall) {
      messages.push(`${name} is taller than the plan allows.`);
    }
    if (posWrong && !tooNarrow && !tooWide && !tooShort && !tooTall) {
      const dx = p.x - g.x;
      const dy = p.y - g.y;
      if (Math.abs(dx) >= Math.abs(dy)) {
        messages.push(
          `${name} is berthed too far ${dx > 0 ? "starboard (right)" : "port (left)"}.`,
        );
      } else {
        messages.push(
          `${name} sits too far ${dy > 0 ? "aft (down)" : "forward (up)"}.`,
        );
      }
    }
  }

  return unique(messages).slice(0, 3);
}

function unique(list: string[]): string[] {
  return [...new Set(list)];
}

export function checkLevel(
  level: Level,
  playerCSS: string,
  playerRoot: HTMLElement,
  goalRoot: HTMLElement,
): CheckResult {
  const messages: string[] = [];

  if (level.requireCSS) {
    for (const token of level.requireCSS) {
      if (!cssContains(playerCSS, token)) {
        messages.push(`This berth plan needs you to use \`${token}\`.`);
      }
    }
  }
  if (level.forbidCSS) {
    for (const token of level.forbidCSS) {
      if (cssContains(playerCSS, token)) {
        messages.push(`Skip \`${token}\` here — the plan calls for a different tool.`);
      }
    }
  }

  const playerHarbor = playerRoot.querySelector(".harbor") as HTMLElement | null;
  const goalHarbor = goalRoot.querySelector(".harbor") as HTMLElement | null;
  if (playerHarbor && goalHarbor) {
    const pd = getComputedStyle(playerHarbor).display;
    const gd = getComputedStyle(goalHarbor).display;
    if (gd === "grid" && pd !== "grid") {
      messages.push("The harbor is not a grid yet. Set display: grid on .harbor.");
    }
  }

  const playerRects = measureItems(playerRoot);
  const goalRects = measureItems(goalRoot);

  if (playerRects.length === 0) {
    messages.push("No dock units found in your preview. Check your CSS selectors.");
    return { ok: false, messages };
  }

  const layoutMsgs = compareLayouts(playerRects, goalRects, level.items);
  const layoutOk = layoutMsgs.length === 0 && playerRects.every((p) => {
    const g = goalRects.find((r) => r.id === p.id);
    return g && near(p.x, g.x) && near(p.y, g.y) && near(p.w, g.w) && near(p.h, g.h);
  });

  if (!layoutOk) {
    messages.push(...layoutMsgs);
    if (layoutMsgs.length === 0) {
      messages.push("The lattice doesn’t match the plan. Compare your dock to the goal.");
    }
  }

  const ok = messages.length === 0 && layoutOk;
  return {
    ok,
    messages: ok ? [] : unique(messages).slice(0, 3),
  };
}

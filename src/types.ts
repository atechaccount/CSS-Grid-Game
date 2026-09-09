export type ItemType =
  | "crate"
  | "airship"
  | "crane"
  | "hangar"
  | "beacon"
  | "balloon"
  | "barrel"
  | "platform"
  | "engine"
  | "tank"
  | "winch"
  | "net"
  | "flagship"
  | "sail"
  | "crew";

export type Narrator = "wren" | "pip";

export type Difficulty =
  | "tutorial"
  | "practice"
  | "challenge"
  | "review"
  | "boss";

export type ItemStyle = "fill" | "token";

export interface GridItem {
  id: string;
  type: ItemType;
  label: string;
  className?: string;
}

export interface Level {
  id: string;
  chapter: number;
  order: number;
  title: string;
  narrator: Narrator;
  story: string;
  objective: string;
  items: GridItem[];
  starterCSS: string;
  solutionCSS: string;
  hints: [string, string, string];
  explanation: string;
  whyItWorked: string;
  realWorld: string;
  concepts: string[];
  difficulty: Difficulty;
  itemStyle?: ItemStyle;
  requireCSS?: string[];
  forbidCSS?: string[];
  boardWidth?: number;
  /**
   * Minimum dock board height in px (default 260). Both the player's dock and the goal dock use
   * the same value, so layout checks compare like with like. The board grows past this when
   * implicit tracks overflow the plan instead of clipping them.
   */
  boardHeight?: number;
}

export interface Chapter {
  id: number;
  shift: string;
  title: string;
  setting: string;
  blurb: string;
  lessonTitle: string;
  lesson: string;
  realWorld: string;
  mistakes: string[];
  concepts: string[];
}

export interface OverlaySettings {
  lines: boolean;
  numbers: boolean;
  labels: boolean;
}

export interface Progress {
  completed: string[];
  lastLevelId: string | null;
  drafts: Record<string, string>;
  hintsUsed: Record<string, number>;
  solutionsRevealed: string[];
  badges: number[];
  seenLessons: number[];
  overlay: OverlaySettings;
  seenTitle: boolean;
}

export interface Rect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CheckResult {
  ok: boolean;
  messages: string[];
}

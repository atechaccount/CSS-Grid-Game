export interface CheatEntry {
  id: string;
  chapter: number;
  title: string;
  code: string;
  note: string;
}

export const cheatsheet: CheatEntry[] = [
  {
    id: "display",
    chapter: 1,
    title: "Make a grid",
    code: "display: grid;",
    note: "Opt-in. Children become grid items.",
  },
  {
    id: "cols",
    chapter: 1,
    title: "Columns",
    code: "grid-template-columns: 1fr 2fr 1fr;",
    note: "fr shares leftover space after fixed tracks and gap.",
  },
  {
    id: "rows",
    chapter: 1,
    title: "Rows",
    code: "grid-template-rows: 80px 1fr;",
    note: "Same idea on the block axis.",
  },
  {
    id: "repeat",
    chapter: 1,
    title: "repeat()",
    code: "grid-template-columns: repeat(4, 1fr);",
    note: "Expands to 1fr 1fr 1fr 1fr.",
  },
  {
    id: "gap",
    chapter: 2,
    title: "gap",
    code: "gap: 8px 16px; /* row column */",
    note: "Between tracks, not around the outer edge.",
  },
  {
    id: "colgap",
    chapter: 2,
    title: "Single-axis gap",
    code: "column-gap: 24px;\nrow-gap: 12px;",
    note: "Use when only one axis needs breathing room.",
  },
  {
    id: "column",
    chapter: 3,
    title: "Line placement",
    code: "grid-column: 1 / 3;\ngrid-row: 2 / span 2;",
    note: "End line is exclusive. 1 / 3 covers two tracks.",
  },
  {
    id: "span",
    chapter: 3,
    title: "span",
    code: "grid-column: span 2;",
    note: "Cover N tracks from the start line.",
  },
  {
    id: "named",
    chapter: 3,
    title: "Named lines",
    code: "grid-template-columns: [port] 1fr [mid] 1fr [star];\ngrid-column: port / star;",
    note: "Names beat magic numbers on living layouts.",
  },
  {
    id: "areas",
    chapter: 4,
    title: "Template areas",
    code: `grid-template-areas:
  "head head"
  "nav  main"
  "foot foot";
.main { grid-area: main; }`,
    note: "Each name must form a rectangle. '.' is empty.",
  },
  {
    id: "minmax",
    chapter: 5,
    title: "minmax()",
    code: "grid-template-columns: repeat(3, minmax(80px, 1fr));",
    note: "Won’t shrink below 80px; can grow equally.",
  },
  {
    id: "autofill",
    chapter: 5,
    title: "auto-fill / auto-fit",
    code: "repeat(auto-fit, minmax(10rem, 1fr))",
    note: "auto-fill keeps empty tracks; auto-fit collapses them.",
  },
  {
    id: "content-size",
    chapter: 5,
    title: "Content tracks",
    code: "grid-template-columns: min-content 1fr max-content;",
    note: "min-content = longest word; max-content = preferred width.",
  },
  {
    id: "flow",
    chapter: 6,
    title: "Auto-flow",
    code: "grid-auto-flow: column dense;",
    note: "column = top-to-bottom. dense backfills holes.",
  },
  {
    id: "grid-sh",
    chapter: 6,
    title: "grid shorthand",
    code: "grid: 80px 1fr / repeat(3, 1fr);",
    note: "rows / columns. Can also include auto-flow.",
  },
  {
    id: "auto-rows",
    chapter: 7,
    title: "Implicit tracks",
    code: "grid-auto-rows: 72px;\ngrid-auto-columns: 1fr;",
    note: "Sizes tracks created by overflow or out-of-range placement.",
  },
  {
    id: "items",
    chapter: 8,
    title: "Align items in cells",
    code: "justify-items: center;\nalign-items: end;",
    note: "Default for every cell. stretch is the initial value.",
  },
  {
    id: "self",
    chapter: 8,
    title: "Align one item",
    code: "justify-self: end;\nalign-self: center;",
    note: "Overrides the container’s items alignment.",
  },
  {
    id: "content",
    chapter: 9,
    title: "Align the grid",
    code: "justify-content: center;\nalign-content: space-between;",
    note: "Only matters when tracks are smaller than the container.",
  },
  {
    id: "place",
    chapter: 10,
    title: "place-* shorthands",
    code: "place-items: center;\nplace-content: start space-evenly;\nplace-self: end;",
    note: "block axis, then inline. One value sets both.",
  },
];

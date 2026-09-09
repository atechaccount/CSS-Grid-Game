/**
 * Harbor glossary entries — the single reference source for CSS Grid terms in the game.
 * `chapter` gates unlocking: an entry appears only once the player has reached that shift.
 */
export interface GlossaryEntry {
  id: string;
  /** Shift that unseals this entry; entries stay hidden until the player reaches it. */
  chapter: number;
  /** Plain-language name shown as the card heading, in harbor voice. */
  title: string;
  /** The CSS property, function, or keyword the entry is about — what a player would search for. */
  term: string;
  /** One or two sentences describing what it does, with no jargon left unexplained. */
  definition: string;
  /** Compact runnable example, one declaration per line. */
  code: string;
  /** When to reach for it, and when not to. */
  whenToUse: string;
}

export const harborGlossary: GlossaryEntry[] = [
  {
    id: "display",
    chapter: 1,
    title: "Make a grid",
    term: "display: grid",
    definition:
      "Turns an ordinary container into a grid, so its children become grid items placed on tracks instead of stacking in normal flow.",
    code: "display: grid;",
    whenToUse: "The first line of every grid layout. Nothing else in this glossary does anything until the container is a grid.",
  },
  {
    id: "cols",
    chapter: 1,
    title: "Columns",
    term: "grid-template-columns",
    definition:
      "Declares the vertical tracks, left to right, one value per column. Values may be lengths, fr shares, or functions.",
    code: "grid-template-columns: 1fr 2fr 1fr;",
    whenToUse: "Whenever you need more than the single default column, or columns of unequal width.",
  },
  {
    id: "rows",
    chapter: 1,
    title: "Rows",
    term: "grid-template-rows",
    definition:
      "Declares the horizontal tracks, top to bottom, one value per row. Same grammar as columns, other axis.",
    code: "grid-template-rows: 80px 1fr;",
    whenToUse: "When deck heights matter: a fixed header strip, equal decks, or a short footer.",
  },
  {
    id: "fr",
    chapter: 1,
    title: "Flexible shares",
    term: "fr",
    definition:
      "A share of the space left over after fixed tracks and gaps are taken out. 2fr takes twice what 1fr takes.",
    code: "grid-template-columns: 1fr 2fr;",
    whenToUse: "Fluid columns and rows that should scale with the container instead of a hard-coded pixel count.",
  },
  {
    id: "repeat",
    chapter: 1,
    title: "Stamp a track",
    term: "repeat()",
    definition: "Writes one track many times. repeat(4, 1fr) expands to four 1fr tracks before layout happens.",
    code: "grid-template-columns: repeat(4, 1fr);",
    whenToUse: "Any repeated track list: a four-bay shelf, a 3×2 lattice, a twelve-column system.",
  },
  {
    id: "gap",
    chapter: 2,
    title: "Clear the taxiways",
    term: "gap",
    definition:
      "Space between tracks only — never around the outer edge. Two values are row-gap then column-gap; one value sets both.",
    code: "gap: 8px 16px; /* row column */",
    whenToUse: "Gutters between cards or cells. Prefer it over margins on the items, which leak onto the outer edge.",
  },
  {
    id: "colgap",
    chapter: 2,
    title: "Single-axis gap",
    term: "column-gap / row-gap",
    definition: "Clearance on one axis alone, leaving the other axis tight.",
    code: "column-gap: 24px;\nrow-gap: 12px;",
    whenToUse: "When the columns need air and the rows should stay shoulder to shoulder, or the reverse.",
  },
  {
    id: "lines",
    chapter: 3,
    title: "Grid lines",
    term: "grid lines",
    definition:
      "The numbered edges of the tracks. N columns have N + 1 lines counted from 1; negative lines count back from the end, so -1 is the last one.",
    code: "grid-column: 1 / 3; /* two tracks */\ngrid-column: 1 / -1; /* every column */",
    whenToUse: "Every placement decision. The end line is exclusive: 1 / 3 covers tracks 1 and 2.",
  },
  {
    id: "column",
    chapter: 3,
    title: "Line placement",
    term: "grid-column / grid-row",
    definition: "Pins an item between two lines on one axis. A single number starts there and covers one track.",
    code: "grid-column: 1 / 3;\ngrid-row: 2 / span 2;",
    whenToUse: "When one unit must sit somewhere specific: a full-width banner, a sidebar, a tall unit on the edge.",
  },
  {
    id: "span",
    chapter: 3,
    title: "Span",
    term: "span",
    definition: "Covers N tracks from wherever the item starts, without naming a line.",
    code: "grid-column: span 2;",
    whenToUse: "When you care how wide or tall something is, not where it starts.",
  },
  {
    id: "named",
    chapter: 3,
    title: "Named lines",
    term: "named lines",
    definition:
      "Names in square brackets inside a track list. Placement can then use the name instead of a number.",
    code: "grid-template-columns: [port] 1fr [mid] 1fr [star];\ngrid-column: port / star;",
    whenToUse: "Living layouts where line numbers would shift as columns are added or removed.",
  },
  {
    id: "areas",
    chapter: 4,
    title: "Template areas",
    term: "grid-template-areas / grid-area",
    definition:
      "A quoted picture of the layout, one string per row. Each child claims a name with grid-area. Every name must form a rectangle; a period is an empty cell.",
    code: `grid-template-areas:
  "head head"
  "nav  main"
  "foot foot";
.main { grid-area: main; }`,
    whenToUse: "Page shells and named regions — head, nav, main, foot — where the picture reads better than line numbers.",
  },
  {
    id: "minmax",
    chapter: 5,
    title: "Clamp a track",
    term: "minmax()",
    definition: "One track with a floor and a ceiling: never narrower than the minimum, grows up to the maximum.",
    code: "grid-template-columns: repeat(3, minmax(80px, 1fr));",
    whenToUse: "Responsive columns that must stay readable at small widths but still fill the container.",
  },
  {
    id: "autofill",
    chapter: 5,
    title: "Count the tracks for me",
    term: "auto-fill / auto-fit",
    definition:
      "Asks Grid to work out the track count from the available width. auto-fill keeps empty tracks; auto-fit collapses them so the rest can grow.",
    code: "repeat(auto-fit, minmax(10rem, 1fr))",
    whenToUse: "Card shelves and galleries that reflow without media queries. Choose auto-fit when empty berths should not hold space.",
  },
  {
    id: "content-size",
    chapter: 5,
    title: "Content tracks",
    term: "min-content / max-content",
    definition:
      "Track sizes driven by what is inside: min-content is the narrowest it can be without breaking a word, max-content is the preferred width with no wrapping.",
    code: "grid-template-columns: min-content 1fr max-content;",
    whenToUse: "Label columns, avatars, and anything that should size to its own contents.",
  },
  {
    id: "flow",
    chapter: 6,
    title: "Auto-flow",
    term: "grid-auto-flow",
    definition:
      "The walking order auto-placement follows. row fills left to right then down; column fills top to bottom; dense goes back to fill holes.",
    code: "grid-auto-flow: column dense;",
    whenToUse: "Column-major layouts and packing small cargo into cells a spanned item left behind.",
  },
  {
    id: "grid-sh",
    chapter: 6,
    title: "grid shorthand",
    term: "grid",
    definition: "Row template, a slash, then column template in one declaration.",
    code: "grid: 80px 1fr / repeat(3, 1fr);",
    whenToUse: "When you want the whole template on one ledger line. Careful: it resets the auto-* properties.",
  },
  {
    id: "auto-rows",
    chapter: 7,
    title: "Implicit tracks",
    term: "grid-auto-rows / grid-auto-columns",
    definition:
      "Sizes the tracks Grid invents on its own — when cargo overflows the plan, or when something is placed past the last line.",
    code: "grid-auto-rows: 72px;\ngrid-auto-columns: 1fr;",
    whenToUse: "Feeds, comment threads, and any list whose length you do not control.",
  },
  {
    id: "items",
    chapter: 8,
    title: "Align items in cells",
    term: "justify-items / align-items",
    definition:
      "The default lashing for every item inside its own cell: justify on the inline (horizontal) axis, align on the block (vertical) axis. Initial value is stretch.",
    code: "justify-items: center;\nalign-items: end;",
    whenToUse: "Centering or edge-aligning cargo inside berths, when the tracks are already the right size.",
  },
  {
    id: "self",
    chapter: 8,
    title: "Align one item",
    term: "justify-self / align-self",
    definition: "Per-item override of the container’s items alignment, on one axis at a time.",
    code: "justify-self: end;\nalign-self: center;",
    whenToUse: "The one mutineer that should sit somewhere the rest of the crew does not.",
  },
  {
    id: "content",
    chapter: 9,
    title: "Align the grid",
    term: "justify-content / align-content",
    definition:
      "Moves or distributes the whole group of tracks inside the container. Only has an effect when the tracks are smaller than the container.",
    code: "justify-content: center;\nalign-content: space-between;",
    whenToUse: "Fixed-size track groups with leftover space. Does nothing at all when fr tracks already fill the box.",
  },
  {
    id: "place",
    chapter: 10,
    title: "place-* shorthands",
    term: "place-items / place-content / place-self",
    definition: "Two-axis shorthands: block axis first, then inline. A single value sets both axes.",
    code: "place-items: center;\nplace-content: start space-evenly;\nplace-self: end;",
    whenToUse: "When both axes get the same alignment and you would rather write one declaration than two.",
  },
];

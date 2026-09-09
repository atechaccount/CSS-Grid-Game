import type { Chapter } from "../types";

export const chapters: Chapter[] = [
  {
    id: 1,
    shift: "Shift I",
    title: "Raise the Lattice",
    setting: "Lattice Yard",
    blurb: "Rebuild the explicit grid so crates stop stacking like a chimney.",
    lessonTitle: "A grid is rows and columns at once",
    lesson:
      "CSS Grid is two-dimensional. Flexbox lines things up on one axis; Grid lets you design rows and columns together. You opt in with display: grid on a container, then cut tracks with grid-template-columns and grid-template-rows.\n\nThe fr unit is a share of leftover free space. Two columns of 1fr 1fr split the dock evenly. 1fr 2fr gives the second berth twice the first. repeat(4, 1fr) is the same as writing 1fr four times — and much kinder at 12 columns.",
    realWorld:
      "Card galleries, dashboards, and any UI you already sketch as a table of regions. If you catch yourself nesting three flexboxes to fake a 2D layout, you wanted Grid.",
    mistakes: [
      "Forgetting display: grid — template properties do nothing on a block box.",
      "Using % for “equal columns” and then adding gap. Percentages don’t subtract gap; fr does.",
      "Mixing up columns (vertical tracks) and rows (horizontal tracks).",
    ],
    concepts: ["display: grid", "grid-template-columns", "grid-template-rows", "fr", "repeat()"],
  },
  {
    id: 2,
    shift: "Shift II",
    title: "Clear the Taxiways",
    setting: "Taxiway Ring",
    blurb: "Put honest space between tracks with gap — not fake margins.",
    lessonTitle: "Gap is track spacing, not item margin",
    lesson:
      "column-gap, row-gap, and the gap shorthand sit between tracks, not around the outer edge. gap: 12px sets both axes. gap: 8px 20px is row then column — same order as the margin shorthand (top/bottom, left/right).\n\nThis is why fr beats percentages for equal columns: 1fr 1fr shares space after gap is reserved. 50% 50% plus a gap can overflow the dock.",
    realWorld:
      "Card grids with consistent gutters, form layouts, and anything that should keep rhythm when you add or remove items.",
    mistakes: [
      "Margin on items double-spaces some edges and misses others.",
      "Writing gap: 20px 8px when you meant wide columns and tight rows — order is row, column.",
      "Equal % tracks plus gap. Use fr.",
    ],
    concepts: ["gap", "column-gap", "row-gap", "fr vs %"],
  },
  {
    id: 3,
    shift: "Shift III",
    title: "Berth Assignments",
    setting: "Berth Office",
    blurb: "Place and span units on numbered (and named) grid lines.",
    lessonTitle: "Lines, not cells, are how Grid counts",
    lesson:
      "A 4-column grid has 5 vertical lines, numbered 1–5. grid-column-start / grid-column-end pin an item to those lines. The shorthand grid-column: 1 / 3 means “start at line 1, end at line 3” — which covers two tracks.\n\nspan 2 means “cover two tracks from wherever you start.” grid-column: 2 / span 2 starts at line 2 and spans two columns.\n\nYou can name lines in the template: [port] 1fr [mid] 1fr [starboard] and then grid-column: port / starboard. Names read better than magic numbers on a living layout.",
    realWorld:
      "Featured cards that span two columns, breakout banners, overlapping hero art, and any item that shouldn’t just auto-sit in the next hole.",
    mistakes: [
      "Thinking grid-column: 1 / 2 spans two columns. It spans one track (line 1 to 2).",
      "Confusing span 2 with end line 2.",
      "Numbering from 0. Grid lines start at 1.",
    ],
    concepts: ["grid-column", "grid-row", "span", "named lines"],
  },
  {
    id: 4,
    shift: "Shift IV",
    title: "Harbor Districts",
    setting: "District Hall",
    blurb: "Name whole regions with template areas — a map instead of coordinates.",
    lessonTitle: "Areas are a readable blueprint",
    lesson:
      "grid-template-areas draws a picture of the layout with quoted rows of names. Each name is a rectangular region. A lone period (.) is an empty cell.\n\nThen each child sets grid-area: name. The names must form rectangles — you can’t make an L-shaped “main”.\n\nAreas win when the page shell matters more than precise spanning math: header / nav / main / footer. Line numbers win for one-off spans inside a card grid.",
    realWorld:
      "App shells, article layouts, admin consoles, and any design you would sketch with labeled boxes.",
    mistakes: [
      "Non-rectangular areas (an L-shape). The browser drops the template.",
      "Mismatched column counts between area rows.",
      "Forgetting to assign grid-area on the children — the picture alone does nothing.",
    ],
    concepts: ["grid-template-areas", "grid-area", "empty cells"],
  },
  {
    id: 5,
    shift: "Shift V",
    title: "Stretch the Canvas",
    setting: "Canvas Loft",
    blurb: "minmax, content-sized tracks, and auto-fill vs auto-fit.",
    lessonTitle: "Tracks that negotiate",
    lesson:
      "minmax(min, max) lets a track refuse to shrink below min and refuse to grow past max. minmax(12rem, 1fr) is the workhorse of responsive card grids.\n\nmin-content is “as small as the longest word / unbreakable item.” max-content is “as wide as the content wants.” auto is similar to minmax(min-content, max-content) but can still stretch.\n\nrepeat(auto-fill, minmax(8rem, 1fr)) creates as many tracks as fit. auto-fill keeps empty tracks; auto-fit collapses them so existing items expand into leftover space.",
    realWorld:
      "Responsive card rows without a pile of media queries. Sidebars that shrink to their labels. Data tables that don’t crush the first column.",
    mistakes: [
      "Swapping auto-fit and auto-fill and wondering why leftover space behaves differently.",
      "minmax(1fr, 200px) — 1fr cannot be the min. Minimums need a definite size.",
      "Forgetting a min on auto-fill tracks, so they collapse to zero.",
    ],
    concepts: ["minmax()", "min-content", "max-content", "auto-fill", "auto-fit"],
  },
  {
    id: 6,
    shift: "Shift VI",
    title: "Traffic Flow",
    setting: "Traffic Loft",
    blurb: "How auto-placement walks the grid, including dense packing.",
    lessonTitle: "The packing algorithm has opinions",
    lesson:
      "Items you don’t explicitly place get auto-placed. grid-auto-flow: row (the default) fills left-to-right, then the next row. column fills top-to-bottom, then the next column.\n\nAdd dense and the algorithm backfills holes left by spanned items. Useful for masonry-like crate walls. Dangerous when source order is the reading order — a later item can visually jump earlier.\n\nThe grid shorthand packs template rows, auto-flow, and template columns into one line: grid: 80px 1fr / repeat(3, 1fr).",
    realWorld:
      "Photo walls, dashboards with mixed tile sizes, and column-major data (timetables, kanban). Avoid dense when accessibility of order matters.",
    mistakes: [
      "Expecting dense to reorder for aesthetics and then breaking tab order.",
      "Setting auto-flow: column but not defining rows — you get one tall column of implicit rows unless rows exist.",
      "Forgetting that placed items reserve cells before auto-placement runs.",
    ],
    concepts: ["grid-auto-flow", "dense", "grid shorthand"],
  },
  {
    id: 7,
    shift: "Shift VII",
    title: "Ghost Docks",
    setting: "Ghost Docks",
    blurb: "Implicit tracks appear when items overflow the explicit grid.",
    lessonTitle: "The grid grows when you overrun it",
    lesson:
      "grid-template-rows and grid-template-columns define the explicit grid. Place an item on line 6 of a 3-column grid, or auto-place more items than cells, and the browser creates implicit tracks.\n\nThose surprise tracks default to auto sizing. Control them with grid-auto-rows and grid-auto-columns. That’s how a “two-row plan” still gives overflow crates a sane height.\n\nMental model: explicit is what you drew. Implicit is what the cargo demanded.",
    realWorld:
      "Feeds of unknown length, user-generated modules, and any board where “exactly N rows” is a lie the data will tell on you.",
    mistakes: [
      "Styling only template-rows and wondering why extra rows look different.",
      "Placing an item at a huge line number and creating a desert of empty implicit tracks.",
      "Assuming implicit columns appear when auto-flow is row — extras become rows, not columns.",
    ],
    concepts: ["implicit grid", "grid-auto-rows", "grid-auto-columns"],
  },
  {
    id: 8,
    shift: "Shift VIII",
    title: "Lash the Cargo",
    setting: "Lash Yard",
    blurb: "Align items inside their cells — the crate in the berth, not the berth on the dock.",
    lessonTitle: "Items live in cells; alignment moves them inside",
    lesson:
      "justify-items (inline / horizontal) and align-items (block / vertical) set the default for every cell. Values: start, end, center, stretch (the default).\n\njustify-self and align-self override one item.\n\nStretch only shows if the item can grow. If you give units a fixed width and height, start/center/end become obvious. This is the crate-in-the-berth problem — not the whole lattice sliding around the dock.",
    realWorld:
      "Icon cells, toolbars, card media that shouldn’t stretch, and form controls sitting neatly in a grid of fields.",
    mistakes: [
      "Using justify-content when you meant justify-items. Content moves tracks; items move inside cells.",
      "Wondering why stretch “does nothing” on an image with intrinsic size and width: 100% already.",
      "Forgetting the axis: justify* is left-right in a horizontal writing mode.",
    ],
    concepts: ["justify-items", "align-items", "justify-self", "align-self"],
  },
  {
    id: 9,
    shift: "Shift IX",
    title: "Shift the Whole Deck",
    setting: "Shift House",
    blurb: "Align the grid tracks inside the container when leftover space remains.",
    lessonTitle: "Content alignment moves the tracks themselves",
    lesson:
      "When tracks are smaller than the container — fixed px columns in a wide harbor — leftover space has to go somewhere. justify-content and align-content distribute that leftover.\n\nstart, end, center pack the grid. space-between puts leftover only between tracks. space-around splits leftover around each track (half on the outer edges). space-evenly gives equal leftover in every gap including the outer edges.\n\nNo leftover space? These properties appear to do nothing. That’s a clue, not a bug.",
    realWorld:
      "Centering a fixed 12-column system on a large screen, spreading a small toolbar, and vertically distributing a short page shell.",
    mistakes: [
      "Trying space-between to pad items inside large cells — that’s items, not content.",
      "Expecting content alignment to work when tracks are 1fr 1fr 1fr (they already ate the free space).",
      "Mixing up around vs evenly on a design spec.",
    ],
    concepts: ["justify-content", "align-content", "space-*"],
  },
  {
    id: 10,
    shift: "Shift X",
    title: "Autumn Convoy",
    setting: "Convoy Spire",
    blurb: "Shorthands and mixed constraints. The convoy does not wait.",
    lessonTitle: "Fluency is combining tools, not memorizing one property",
    lesson:
      "place-items is align-items + justify-items. place-content is align-content + justify-content. place-self is align-self + justify-self. One-value form sets both axes; two values are block then inline.\n\nThe grid shorthand can set rows, columns, and auto-flow together. You already know every piece — this shift is about reading a plan and picking the smallest honest CSS that berths it.\n\nThe Autumn Convoy arrives at dusk. If the lattice holds, Nimbus Reach works again.",
    realWorld:
      "Production layouts are never one chapter. A page shell (areas) plus a card grid (auto-fit) plus a spanned banner (lines) is a normal Tuesday.",
    mistakes: [
      "Reaching for the newest shorthand when a clear longhand would debug faster.",
      "Copying a full grid: reset and accidentally wiping template-areas.",
      "Skipping gap until the end, then watching every span look “off.”",
    ],
    concepts: ["place-items", "place-content", "place-self", "grid shorthand", "mixed layouts"],
  },
];

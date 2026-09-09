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
    properties: [
      {
        name: "display: grid",
        does: "Turns the element into a grid container — its direct children become grid items laid out in rows and columns. Without it, every template property below does nothing.",
      },
      {
        name: "grid-template-columns",
        does: "Cuts the vertical tracks: one size per column, space-separated, so \"120px 1fr 2fr\" is a three-column grid with those widths.",
      },
      {
        name: "grid-template-rows",
        does: "The same thing for horizontal tracks: one size per row, in order, top to bottom.",
      },
      {
        name: "fr",
        does: "A share of the space left over after fixed sizes and gap are paid. 1fr 1fr splits evenly; 1fr 2fr gives the second track twice the first.",
      },
      {
        name: "repeat()",
        does: "Compresses a repeated track list: repeat(4, 1fr) is exactly \"1fr 1fr 1fr 1fr\" — and far kinder to read at 12 columns.",
      },
    ],
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
    properties: [
      {
        name: "gap",
        does: "Shorthand for the space between tracks on both axes at once: gap: 12px sets rows and columns. It sits between tracks only — never on the outer edge.",
      },
      {
        name: "row-gap",
        does: "Space between consecutive rows only. In the two-value shorthand (gap: 8px 20px) it comes first.",
      },
      {
        name: "column-gap",
        does: "Space between consecutive columns only. In the two-value shorthand it comes second.",
      },
      {
        name: "fr vs %",
        does: "fr shares out what remains after gap is reserved, so equal fr tracks always fit; percentages ignore gap, so 50% 50% plus any gap overflows the dock.",
      },
    ],
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
    properties: [
      {
        name: "grid-column",
        does: "Where an item sits horizontally, as start line / end line: grid-column: 1 / 3 runs from line 1 to line 3 and covers two tracks (the end line is exclusive).",
      },
      {
        name: "grid-row",
        does: "The same placement for vertical position: grid-row: 2 / 4 pins an item from row line 2 to line 4, spanning two rows.",
      },
      {
        name: "span",
        does: "Cover N tracks from wherever you start: grid-column: 2 / span 2 begins at line 2 and takes two columns — no end-line arithmetic.",
      },
      {
        name: "named lines",
        does: "Names declared in brackets in the template ([port] 1fr [mid] 1fr [starboard]) become usable start/end lines: grid-column: port / starboard.",
      },
    ],
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
    properties: [
      {
        name: "grid-template-areas",
        does: "Draws the whole layout as quoted rows of names; every repetition of a name merges into one rectangular region (L-shapes are rejected and the template is dropped).",
      },
      {
        name: "grid-area",
        does: "Assigns a child to a named region: grid-area: head puts that item in every cell the head region covers. Also the shorthand for all four placement lines.",
      },
      {
        name: "empty cells",
        does: "A lone period (.) in the template leaves that cell intentionally empty — no item can claim it.",
      },
    ],
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
    properties: [
      {
        name: "minmax()",
        does: "Clamps one track between a floor and a ceiling: minmax(12rem, 1fr) never shrinks below 12rem and shares leftover space above it. The minimum must be a definite size — 1fr cannot be a min.",
      },
      {
        name: "min-content",
        does: "The narrowest the track can be without content overflowing — roughly the width of its longest word.",
      },
      {
        name: "max-content",
        does: "As wide as the content wants when nothing is allowed to wrap.",
      },
      {
        name: "auto-fill",
        does: "Inside repeat(), spins up as many tracks as fit and keeps the spares empty but reserved: repeat(auto-fill, minmax(8rem, 1fr)).",
      },
      {
        name: "auto-fit",
        does: "Same as auto-fill, then collapses the empty tracks so the items you did place stretch into the leftover space.",
      },
    ],
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
    properties: [
      {
        name: "grid-auto-flow",
        does: "The direction auto-placement walks: row (the default) fills a row left-to-right before starting the next; column fills top-to-bottom before starting the next column.",
      },
      {
        name: "dense",
        does: "Lets the packer backfill holes left behind by bigger spanned items — later small items jump into earlier gaps, which changes visual (and reading) order.",
      },
      {
        name: "grid shorthand",
        does: "Rows, flow, and columns in one line: grid: 80px 1fr / repeat(3, 1fr) reads \"rows 80px 1fr, columns repeat(3, 1fr)\".",
      },
    ],
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
    properties: [
      {
        name: "implicit grid",
        does: "Tracks the browser creates by itself when items overrun the explicit template — they default to auto sizing, which is why surprise rows can look different from planned ones.",
      },
      {
        name: "grid-auto-rows",
        does: "The size handed to every implicitly created row: grid-auto-rows: 96px gives overflow rows a real height instead of auto.",
      },
      {
        name: "grid-auto-columns",
        does: "The same deal for implicitly created columns, which appear when auto-flow is column or an item is placed past the last explicit column line.",
      },
    ],
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
    properties: [
      {
        name: "justify-items",
        does: "Sets the default horizontal alignment of items inside their own cells: start, end, center, or stretch (the default).",
      },
      {
        name: "align-items",
        does: "The same default alignment, on the vertical (block) axis.",
      },
      {
        name: "justify-self",
        does: "Overrides the horizontal alignment for one item only — the crate, not the whole yard.",
      },
      {
        name: "align-self",
        does: "Overrides the vertical alignment for one item only.",
      },
    ],
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
    properties: [
      {
        name: "justify-content",
        does: "Distributes the tracks themselves — the whole lattice — horizontally inside the container, but only when the tracks leave leftover space.",
      },
      {
        name: "align-content",
        does: "The same distribution of leftover space, on the vertical axis: it moves the rows, not the items inside them.",
      },
      {
        name: "space-*",
        does: "Leftover-space flavors: space-between puts it all between tracks, space-around adds half-gutters on the outer edges, space-evenly makes every gap identical. With 1fr tracks they do nothing — the tracks already ate the free space.",
      },
    ],
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
    properties: [
      {
        name: "place-items",
        does: "align-items and justify-items in one declaration: one value covers both axes, two values read vertical then horizontal.",
      },
      {
        name: "place-content",
        does: "align-content and justify-content together — the leftover-space distribution for both axes at once.",
      },
      {
        name: "place-self",
        does: "align-self and justify-self for a single item, same one/two-value pattern.",
      },
      {
        name: "grid shorthand",
        does: "Packs rows, flow, and columns into one declaration — powerful, but it resets any part of the grid it does not mention, so template-areas can be wiped by a careless copy.",
      },
    ],
  },
];

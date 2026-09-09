# Sky Dock — Harbor Lines

A story-driven CSS Grid campaign. You are Harbor Gridwright at Nimbus Reach. Write real CSS. Berth airships. Restore the lattice before the Autumn Convoy arrives.

## Chosen theme

**Sky Dock** (floating sky harbor — airships, cranes, hangars, beacons).

Why this fits CSS Grid:

- A harbor is already a grid: berths are tracks, taxiways are gaps, districts are areas.
- Line-based placement maps cleanly onto “berth 2 through 4.”
- Implicit tracks are ghost docks that appear when cargo overflows the plan.
- Alignment is lashing cargo inside a berth versus shifting the whole deck.

It is original. It is not Grid Critters, not an alien/space-critter story, and not a garden.

## Chapters (all playable)

| Shift | Title | Topic | Levels |
| --- | --- | --- | --- |
| I | Raise the Lattice | `display: grid`, templates, `fr`, `repeat()` | 10, complete |
| II | Clear the Taxiways | `gap` / `column-gap` / `row-gap`, fr vs % | 8, complete |
| III | Berth Assignments | line placement, `span`, named lines | 10, complete |
| IV | Harbor Districts | `grid-template-areas`, empty cells | 8, complete |
| V | Stretch the Canvas | `minmax()`, `auto-fill` / `auto-fit`, content tracks | 7, complete |
| VI | Traffic Flow | `grid-auto-flow`, `dense`, `grid` shorthand | 6, complete |
| VII | Ghost Docks | implicit tracks, `grid-auto-rows/columns` | 6, complete |
| VIII | Lash the Cargo | `justify/align-items` and `*-self` | 7, complete |
| IX | Shift the Whole Deck | `justify/align-content`, space-* | 6, complete |
| X | Autumn Convoy | `place-*`, mixed layouts, finale boss | 8, complete |

**76 levels.** Every level has a goal dock, live preview, hints, a reference solution, and layout-based validation (equivalent CSS is accepted unless the berth requires a specific function such as `repeat()` or `auto-fit`).

## Run

Dev server (not port 3000). `vite.config.ts` pins the host, port, and the `*.e2b.app` preview host, so a bare `npm run dev` is enough:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview -- --port 5420
```

The build is a single self-contained `dist/index.html` (art is imported from `src/assets` and inlined), so it can be opened or hosted anywhere.

Progress is stored in `localStorage` under `skydock-progress-v1`.

## How to add a level

Levels live in `src/data/levels-early.ts` (chapters 1–5) and `src/data/levels-late.ts` (chapters 6–10). Export them through `src/data/levels.ts`.

A level object needs:

- `id`, `chapter`, `order`, `title`, `narrator` (`wren` | `pip`)
- `story`, `objective`
- `items` — `{ id, type, label, className? }`
- `starterCSS`, `solutionCSS`
- `hints` (three escalating strings)
- `explanation`, `whyItWorked`, `realWorld`, `concepts`
- `difficulty` — `tutorial` | `practice` | `challenge` | `review` | `boss`
- Optional: `itemStyle: "token"` for cell-alignment drills, `requireCSS`, `forbidCSS`, `boardHeight`

Write the `objective` as the visible result — what the player should see on the Goal dock, dimensions included — not as the CSS to type. The only exception is a berth that mandates a specific tool (`requireCSS`), which may name that tool but never its values.

Hints escalate in three rungs:

1. a conceptual nudge, no property name;
2. the likely CSS tool (naming the property is the point of this rung);
3. the shape of the syntax with placeholders, or a near-miss example (`1fr 1fr 1fr` when the berth wants two), never the reference solution.

The optional **Useful tool** reveal under the goal is derived from the level data by `usefulToolsForLevel` (`src/engine/level-tools.ts`): the property names the reference solution adds to the starter CSS. Values are never shown, so there is nothing to keep in sync when a solution changes.

Validation compares item bounding boxes of Your dock vs Goal dock (with a few pixels of tolerance) and then applies any `requireCSS` / `forbidCSS` needles. Prefer checking layout so `grid-column: 1 / 3` and `span 2` from line 1 can both pass.

## Pedagogy

Each berth: story → goal → write CSS → live preview → check → hints → reveal → why it worked → persist.

Review and boss levels mix earlier tools. After eight clears, the harbor chart offers a **Rerig drill** (random previously passed level).

The **Harbor glossary** (`src/data/harbor-glossary.ts`, rendered by `src/components/HarborGlossary.tsx`) is the only reference screen: searchable, unlocked by shift, one entry per term with a plain-language definition, a compact example, and when to use it. Add new terms there rather than starting a second reference.

## Note on IP

Inspired by the *learning loop* of games like Grid Critters, not by their story, characters, copy, or branding.

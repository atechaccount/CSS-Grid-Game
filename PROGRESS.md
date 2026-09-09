# Progress

## Now

Nothing in flight. The editor and responsive play-screen pass from `TODO.md` is implemented; the
only open item is human verification in a real browser, which this environment cannot run
(no browser is installable: the Playwright CDN and the Debian mirrors are both unreachable).

## Next

- Manual pass in a real browser at 1366x768, 1024x768, 768x1024, 390x844, and 360x800, plus 200%
  zoom, keyboard-only use, and a touch device. The layout rules are written for these cases but
  have only been checked structurally (see Done).
- `dist/index.html` is a single 2.9 MB file because `vite-plugin-singlefile` inlines the five art
  plates as base64. If that is too heavy to host, drop the plugin or move the art back to
  `public/` and serve `dist/` as a directory.

## Done

- **Production build fixed.** The five art plates moved from `public/images/` to `src/assets/`, so
  `src/assets/art.ts` imports resolve through Vite. `npm run build` now completes
  (`dist/index.html`, 2,904 kB) and `npx tsc --noEmit` is clean.
- **CodeMirror 6 editor.** `src/components/CssEditor.tsx` replaced the textarea-plus-highlight-overlay
  with a real editor: line numbers, CSS syntax highlighting, bracket matching, automatic closing
  brackets, Tab/Shift-Tab indent and outdent, undo/redo, visible focus ring and selection, and
  Mod+Enter to check. The `value` / `onChange` / `onRun` contract is unchanged, so drafts and level
  checks work as before. Escape blurs the editor so keyboard-only players are not trapped by Tab.
  The input font is 16px at <=640px to stop iOS Safari zooming.
- **Objectives and hints rewritten** for all 76 berths. Objectives describe the visible result;
  only berths that mandate a tool (`requireCSS`) name it, and never with values. Hints are now
  nudge → tool → syntax shape.
- **"Useful tool" reveal** under the goal names the properties the reference solution adds to the
  starter CSS (`usefulToolsForLevel` in `src/engine/level-tools.ts`). Derived, so it cannot drift.
- **Cheatsheet became the Harbor glossary**: `src/data/harbor-glossary.ts` (22 entries, term +
  plain-language definition + example + when to use it, unlocked by shift) and
  `src/components/HarborGlossary.tsx` (search box, live count, empty state). No second reference
  screen was added.
- **Dock previews stopped being cropped.** The board is `min(100%, 360px)` wide instead of a fixed
  360px, and the board height became a minimum so an implicit ghost deck grows the board instead of
  being clipped by `overflow: hidden`. Both docks always stay mounted at the same width — validation
  measures the goal dock even when it is the hidden one — and the hidden dock uses
  `visibility: hidden` in the same grid cell, never `display: none`.
- **Pane behaviour:** side by side on wide screens, auto-stacked when the stage is too narrow for
  two readable docks, one at a time on phones with an Expand overlay (680px board, Yours/Goal
  switch). An explicit Yours/Goal/Both choice survives a viewport change; the default follows it.
- **Header and Check dock reachability:** the five-control header wraps instead of crushing the
  title, controls are >=2.5rem tall, and on narrow screens the editor height is capped with
  `clamp()` and the action row is sticky so Check dock stays on screen while editing.
- `vite.config.ts` pins host/port and allows the `*.e2b.app` preview host.

## Decisions

- **Art is imported from `src/assets`, not referenced from `public/`.** The single-file build is the
  point of `vite-plugin-singlefile`, and inlining keeps `dist/index.html` self-contained. Cost: a
  2.9 MB HTML file.
- **Hidden docks stay in the layout.** Validation compares player and goal rectangles, so the
  off-screen dock must be laid out at the same width. `visibility: hidden` in a shared grid cell
  gives that without a `display: none` measurement hole and without the old `left: -80rem` hack.
- **The useful-tool list is derived, not authored.** Duplicating the tool name per level would be a
  second source of truth that drifts the first time a solution changes.
- **Fixed dimensions stay in objectives.** "Two 72px berths" is a visible measurement the player
  cannot infer from the goal dock; naming a property or value they must type is the thing to avoid.

## Audit — representative berths

Prompt and hint progression checked across early, middle, and late shifts. No objective names a
property from its own reference solution; no H1 or H3 copies a declaration out of the solution.

| Berth | Kind | Result |
| --- | --- | --- |
| c1-01 Planks in Parallel | tutorial (early) | Explicit teaching kept on purpose: H1 names `display: grid`, H2 the property, H3 gives the near-miss `1fr 1fr 1fr` for a two-column berth. |
| c1-08 Beacon Flanks | challenge (early) | Objective carries the 72px measurement because it is not inferable; hints never name the track list. |
| c1-09 Control Strip | review (early) | Reduced scaffolding: hints mix axes and units without dictating values. |
| c1-10 Lattice Yard Boss | boss (early) | Mandated `repeat()` named as a constraint only; counts left to the player. |
| c4-05 When Lines Still Win | review (middle) | `forbidCSS` is stated as "no district map allowed" so the constraint is not a surprise at check time. |
| c5-03 Fill the Shelf | practice (middle) | Objective describes the auto-fill behaviour ("empty bays still hold their space") without naming the keyword. |
| c5-07 Canvas Loft Boss | boss (middle) | Three tools required; H3 gives the shape with `<floor>` placeholders. |
| c8-06 Trap: Items, Not Content | challenge (late) | H1 explains why content alignment does nothing; H2 names the family; H3 names the property. |
| c9-05 Trap: Content, Not Items | challenge (late) | Mirror of c8-06, same ladder shape. |
| c10-07 Rerig the Whole Chart | review (late) | Objective describes positions only; the repeated-shape note stays in H1. |
| c10-08 Autumn Convoy | boss (late) | Finale names the five districts and the gap requirement, not the area strings. |

Automated checks run against the real modules (esbuild-bundled `src/data/levels.ts`,
`src/data/harbor-glossary.ts`, `src/engine/level-tools.ts`):

- objective spoiler scan (solution property names in objective text): 0 hits across 76 berths
- H1/H3 verbatim-solution scan: 0 hits
- hint ladder shape: 76/76 have three non-empty rungs; every H2 names either a solution property or
  the mandated keyword (`repeat()`, `span`, `minmax()`, `auto-fit`, `dense`)
- level integrity: 76 levels, 76 unique ids, no empty objectives
- glossary: 22 entries, unique ids, no missing fields, chapters 1-10 all covered

UI smoke test (jsdom + react-dom, exercising the real `App`, `CssEditor`, `PlayScreen`,
`GridPreview`, `HarborGlossary`, `usefulToolsForLevel`): 31/31 checks pass, covering editor
initialisation and document sync, Reset, Check dock, the hint ladder, the useful-tool reveal,
glossary search and unlock gating, the expand overlay, pane defaults at 1400px and 390px, and
progress persistence. jsdom has no layout engine, so every rectangle is zero — this run does not
validate layout comparison or any visual spacing.

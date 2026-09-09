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

## Play it

Production: https://atechaccount.github.io/CSS-Grid-Game/

## Deployment

The site is a static build published to GitHub Pages from the `gh-pages` branch, with production at the branch root and pull request previews beside it.

| What | Where | Workflow |
| --- | --- | --- |
| Production | https://atechaccount.github.io/CSS-Grid-Game/ | `.github/workflows/deploy-production-pages.yml`, on every push to `main` |
| Pull request preview | `https://atechaccount.github.io/CSS-Grid-Game/pr-preview/pr-<number>/` | `.github/workflows/deploy-pull-request-preview.yml`, on open, reopen, and every push |
| Preview cleanup | preview directory deleted | `.github/workflows/cleanup-pull-request-preview.yml`, when the pull request closes |

Each preview build gets its own base path, so previews never overwrite production and never overwrite each other. A production deploy replaces the branch root but leaves `pr-preview/` alone. All three workflows share the `gh-pages-branch` concurrency group so two publishes cannot race, and `.github/scripts/publish-gh-pages-directory.sh` rewrites only its own directory of the branch.

Each preview posts one comment on its pull request and edits that same comment on later pushes and on close. GitHub Pages usually serves a new deploy within a minute.

### Base path

`vite.config.ts` builds with `base` set to `/CSS-Grid-Game/`. Set `SKYDOCK_BASE_PATH` to override it, which is how preview builds get `/CSS-Grid-Game/pr-preview/pr-<number>/`. The dev server always serves from `/`.

### Fork pull requests are not previewed

Preview deployment runs on `pull_request` and is skipped for pull requests from forks. Previewing a fork would mean building untrusted code with a token that can write to the repository, which is exactly what `pull_request_target` misuse enables, so forks get no preview instead. Fork changes are previewed once they land on `main`, or by pushing the branch to this repository.

### Required repository settings

- Settings → Pages → Source: **Deploy from a branch**, branch `gh-pages`, folder `/ (root)`.
- Settings → Actions → General → Workflow permissions: **Read and write permissions** - the workflows push the `gh-pages` branch with `GITHUB_TOKEN`. Each workflow still requests only `contents: write` and, where it comments, `pull-requests: write`.

## Run

Dev server (not port 3000):

```bash
npm ci
npx vite --port 5420
```

Build:

```bash
npm run build
npm run preview -- --port 5420
```

The build inlines everything into a single `dist/index.html`. Character and chapter art is imported from `src/assets` so Vite bundles it; it is not served from `public`.

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

Validation compares item bounding boxes of Your dock vs Goal dock (with a few pixels of tolerance) and then applies any `requireCSS` / `forbidCSS` needles. Prefer checking layout so `grid-column: 1 / 3` and `span 2` from line 1 can both pass.

## Pedagogy

Each berth: story → goal → write CSS → live preview → check → hints → reveal → why it worked → persist.

Review and boss levels mix earlier tools. After eight clears, the harbor chart offers a **Rerig drill** (random previously passed level).

## Note on IP

Inspired by the *learning loop* of games like Grid Critters, not by their story, characters, copy, or branding.

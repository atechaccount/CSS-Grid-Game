# TODO

## Now

### Verify the play screen in a real browser

The editor and responsive play-screen pass is implemented (see `PROGRESS.md` → Done) and merged.
The visual half of the brief is still unverified by a human, but it is no longer blocked: the site is
live at https://atechaccount.github.io/CSS-Grid-Game/, so this can be checked on a real phone and
laptop without a local build.

- Load the game at 1366x768, 1024x768, 768x1024, 390x844, and 360x800, plus 200% browser zoom.
- Confirm both dock previews stay uncropped, labels stay readable, and nothing is silently cut off.
- Confirm the five-control header wraps without crushing the level title on short laptop screens.
- Confirm Check dock stays reachable while the editor has focus on a phone.
- Confirm keyboard-only use: Tab reaches every control, Escape leaves the editor, Mod+Enter checks,
  and focus is visible everywhere.
- Confirm the editor on a touch device: 16px input font, no unwanted page zoom, usable caret.
- Report every remaining build, interaction, accessibility, or visible layout defect.

## Later

- Remove the Arena sandbox artifacts from `vite.config.ts`. `host: "0.0.0.0"` and
  `allowedHosts: [".e2b.app"]` exist only so an e2b preview proxy could reach the dev server. They
  affect the dev server only, never the build, but they do not belong in the tracked config.
- Give the game its own storage origin, or namespace the key. Progress is saved in `localStorage`
  under `skydock-progress-v1` (`src/store/progress.ts`), and `localStorage` is scoped to the origin,
  not the path. Every pull request preview under
  `https://atechaccount.github.io/CSS-Grid-Game/pr-preview/pr-<number>/` therefore reads and writes
  the same saved progress as production, as does any other project published to
  `atechaccount.github.io`. A preview running changed progress code can corrupt real progress.

- Decide whether the single-file build is the right distribution shape. `dist/index.html` is 2.9 MB
  because `vite-plugin-singlefile` inlines the five art plates as base64. Alternatives: drop the
  plugin, or move the art back to `public/` and serve `dist/` as a directory.
- Add a small automated test setup (vitest + jsdom) and keep the UI smoke checks that currently live
  outside the repository, so editor, pane, and glossary behaviour is regression-tested.

## Someday

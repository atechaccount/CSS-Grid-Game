# TODO

## Now

### Verify the play screen in a real browser

The editor and responsive play-screen pass is implemented (see `PROGRESS.md` → Done), but this
sandbox cannot install a browser, so the visual half of the brief is still unverified by a human.

- Load the game at 1366x768, 1024x768, 768x1024, 390x844, and 360x800, plus 200% browser zoom.
- Confirm both dock previews stay uncropped, labels stay readable, and nothing is silently cut off.
- Confirm the five-control header wraps without crushing the level title on short laptop screens.
- Confirm Check dock stays reachable while the editor has focus on a phone.
- Confirm keyboard-only use: Tab reaches every control, Escape leaves the editor, Mod+Enter checks,
  and focus is visible everywhere.
- Confirm the editor on a touch device: 16px input font, no unwanted page zoom, usable caret.
- Report every remaining build, interaction, accessibility, or visible layout defect.

## Later

- Decide whether the single-file build is the right distribution shape. `dist/index.html` is 2.9 MB
  because `vite-plugin-singlefile` inlines the five art plates as base64. Alternatives: drop the
  plugin, or move the art back to `public/` and serve `dist/` as a directory.
- Add a small automated test setup (vitest + jsdom) and keep the UI smoke checks that currently live
  outside the repository, so editor, pane, and glossary behaviour is regression-tested.

## Someday

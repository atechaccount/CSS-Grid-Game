# TODO

## Now

Nothing. Level sealing has been removed entirely: every shift and every berth on the harbor
chart is clickable at all times (numbered berth pills on each shift card), the in-game berth
dropdown lists all options, the glossary is fully open, and "Next berth/shift" flows freely.
`?unlock=all` is still accepted but is now a no-op; `?level=<id>` deep links remain.

The play-screen verification pass is complete (see `PROGRESS.md` → Done): a real Chromium ran
the whole checklist at 1366x768, 1024x768, 768x1024, 390x844, 360x800, and 200%-zoom
emulation, against both the dev server and the production `dist/` build. The two bugs the pass
surfaced (a `Maximum update depth exceeded` loop during fast typing, with two contributing
causes) are fixed and regression-tested.

What a sandbox cannot prove, and the only residual trust gap: the audit ran in emulated
viewports (including touch and 200% zoom emulation), not on physical devices. If anything
looks off on real hardware, `?level=<berth-id>` deep-links straight to the berth to reproduce.

## Later

- Give the game its own storage origin. Progress is now namespaced per deployment
  (`skydock-progress-v1:<base-path>` in `src/store/progress.ts`), so previews can no longer
  corrupt production, but every deployment still lives on the shared `atechaccount.github.io`
  origin. A dedicated origin would isolate cookies and service workers too, if those ever land.
- The single-file build stays: `dist/index.html` (2.9 MB, 1.9 MB gzipped) is self-contained,
  which keeps the gh-pages publish script and pr-preview workflow trivial. Revisit only if the
  page weight ever measurably hurts players; the alternative shape (drop
  `vite-plugin-singlefile`, serve `dist/` as a directory) is a one-line change.
- Google Fonts is a runtime external dependency (`index.html` links fonts.googleapis.com with
  `display=swap`, so offline or blocked networks fall back to system fonts). Self-hosting the
  three families through `src/assets/` would inline them into the single-file build and remove
  the external request.
- The old `?unlock=all` handling could be deleted outright once nothing references it; for now
  the param is parsed and ignored so old links do not 404 anywhere or surprise anyone.

## Someday

- The browser audit scripts used for the verification pass live outside the repo (Playwright
  + a serverless Chromium build). If they are ever needed again, they can be reconstructed from
  `PROGRESS.md` → Done; the in-repo vitest suite covers the logic they cannot (jsdom has no
  layout engine), and these covered the pixels.

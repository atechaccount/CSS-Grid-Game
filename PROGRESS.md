# Progress

## Now

Nothing in flight. The verification pass, the unlock/deep-link feature, the namespaced storage
key, the vite config cleanup, and the in-repo test suite are all landed; see Done.

## Next

Nothing queued. `TODO.md` holds the remaining ideas (storage origin, self-hosted fonts) and the
one honest residual: the layout audit ran in an emulated browser, not on physical devices. The
open-chart change postdates that audit and is covered by the vitest suite plus a browser spot
check of the chart pills.

## Done

- **Per-shift property explanations.** Every chapter now carries a curated `properties` list
  (`PropertyNote` in `src/types.ts`): one entry per property/keyword the shift teaches, each
  with exactly one sentence on what the property does when the browser applies it — 38 notes
  across the 10 shifts (e.g. `grid-column` "runs from line 1 to line 3 and covers two tracks —
  the end line is exclusive"). They render two ways: a collapsible "What the properties do"
  section on every chart card (native `<details>`, collapsed by default), and a "The properties
  in this shift" list in the chapter Lesson modal. Chart notes are light-on-dark, lesson notes
  dark-on-paper (an earlier single-color rule failed contrast on the paper modal — caught by
  screenshot). Covered by 3 tests (data integrity, concepts consistency, chart toggle) and a
  browser pass (all 38 notes render, no overflow, modal lists all 5 for Shift I).
- **Sealing removed — the campaign is a menu, not a gate.** Every shift card on the harbor
  chart is always clickable and carries a row of numbered berth pills, so any level is one
  click from the chart (pills show a check mark once cleared). The in-game berth dropdown
  enables every option, "Next berth/shift" flows across shifts without checks, the glossary is
  fully open, and `Progress.unlockedChapter` is gone (legacy saves carrying the field load
  fine; the field is dropped on load and never re-persisted). `?unlock=all` is still accepted
  as a no-op; `?level=<id>` deep links are unchanged. The chart card click keeps the convenient
  default of opening the shift's next uncleared berth.
- **Play screen verified in a real browser — the pass that was previously blocked.** The
  Playwright CDN and Debian mirrors were unreachable when this was last attempted, but the npm
  registry is not, so the audit ran on `@sparticuz/chromium` (a Chromium binary shipped as an
  npm package) driven by playwright-core. Checklist from `TODO.md`, all green on dev server and
  production `dist/`, at 1366x768, 1024x768, 768x1024, 390x844, 360x800, and 683x384@2x (200%
  zoom emulation):
  - no horizontal document overflow at any viewport; both dock previews stay inside the
    viewport and uncropped; dock labels render at full size (ellipsis is the designed
    degradation and is applied per label);
  - the five-control header wraps without crushing the level title on short laptop screens;
  - Check dock stays reachable while the editor has focus on phone viewports (sticky action
    row confirmed in screenshots at 768x1024 and 390x844);
  - keyboard-only: Tab reaches Chart, berth select, Glossary, Lesson, pane toggles, editor,
    and every editor action; focus indication present at every stop; Escape leaves the editor;
    Mod+Enter runs a check from anywhere (verified inside the editor);
  - touch emulation: tapping focuses the editor, caret usable (`user-select` intact),
    `width=device-width` meta present, editor input font 16px at <=640px so iOS Safari would
    not zoom the page;
  - full gameplay loop in a real layout engine: starter CSS correctly fails the c1-01 check,
    pasted/typed solution CSS passes, verdict modal opens, progress records;
  - `?unlock=all` unseals all 10 shifts on the chart in the real browser; `?level=c10-08`
    deep-link lands on the finale.
- **Two real bugs found and fixed by the audit** (both invisible to jsdom, which has no layout
  engine and no real event loop interleaving):
  - `GridPreview`'s ResizeObserver callback called `setTracks` with a fresh object on every
    delivery even when the measurement was unchanged; under typing-driven layout churn the
    RO -> setState -> render -> RO cycle never converged and React threw
    `Maximum update depth exceeded`. The callback is now idempotent (`sameTracks` guard).
  - `CssEditor` reported document changes synchronously from inside CodeMirror's
    MutationObserver flush. During fast typing that flush interleaves with React's concurrent
    work loop, and the per-keystroke `setState` chain nested until React threw the same error
    (reproduced ~25% of stress runs, always with the update listener on the stack). Reports are
    now coalesced and deferred to a macrotask — clean stack, newest document wins, and any
    external change landing mid-burst is respected.
  - `CssEditor`'s external-value sync also got a sequencing guard: a lagging commit of a value
    the editor itself emitted can never revert newer in-flight typing (the old code compared
    strings and could loop or revert), while external values (Reset, level switch, draft
    restore) still apply synchronously, including re-applying a previously-emitted draft when
    the parent asks for it.
  - Regression tests for all three are in the vitest suite; a 20-iteration browser stress run
    of the previously-failing sequence is clean.
- **Unlock-all and berth deep-links.** `?unlock=all` unseals every shift (persisted; survives
  reload without the param and survives "New posting"), `?level=<id>` opens any berth and
  raises the unlock to its shift. Unknown ids fall back to the title screen. Implemented in
  `App.tsx` (`bootFromQuery`), covered by app-level tests.
- **Progress storage namespaced per deployment** (`src/store/progress.ts`): the key is now
  `skydock-progress-v1:<BASE_URL>`, so production, each pr-preview, and dev each get their own
  save instead of sharing one origin-wide blob. Existing saves migrate transparently from the
  legacy bare key, which is never written again.
- **Sandbox artifacts removed from the tracked vite config.** `host: "0.0.0.0"` and
  `allowedHosts: [".e2b.app"]` moved out of `vite.config.ts` into a gitignored
  `vite.config.sandbox.ts` (merged via `SKYDOCK_SANDBOX=1` script wrappers). Tracked config is
  deployable as-is; the preview environment keeps its overrides.
- **In-repo test suite: vitest + jsdom + Testing Library, 45 tests, wired into CI**
  (`npm test`, a step in `verify-pull-request.yml`). The previously-external UI smoke checks
  now live in the repo: level/glossary data integrity, progress store (round-trip, migration,
  namespacing, corruption fallback), editor lifecycle (init, level switch, Reset, draft
  persistence, the typing-race guards), Check dock flow (requireCSS failure via fail list,
  solution pass, badge + unlock on chapter completion), hint ladder, useful-tool reveal,
  glossary search/sealing/close, pane defaults at wide and phone widths, explicit
  Yours/Goal/Both override, expand overlay, overlay toggles, and the title -> map -> play flow
  including every query-override path. `window.matchMedia`, ResizeObserver, and Range geometry
  are stubbed in `src/test/setup.ts`; the viewport is switchable per test.
- **Production build re-verified:** `npx tsc --noEmit` clean, `npm run build` produces
  `dist/index.html` (2,906 kB; 1,879 kB gzipped), and the full browser audit passes against the
  built artifact served by `vite preview`.

## Decisions

- **Emulated verification is recorded as verification, with the device caveat stated.** The
  point of the pass was to exercise the real layout engine, real focus handling, and real
  input pipelines after a year of jsdom-only checks; that barrier is crossed. Physical-device
  spot checks remain cheap because of `?level=` deep links.
- **The editor stays a controlled component.** The alternative (letting CodeMirror own the
  document and only listen) would have dodged the race by giving up Reset/level-switch/draft
  restore semantics that the game relies on. The sequence-number guard keeps the contract:
  prop is authoritative except when it is demonstrably a lagging echo of local typing.
- **Deferred (macrotask) editor reports over synchronous ones.** Synchronous reporting put a
  React setState inside CodeMirror's DOM-observer flush; React 19's concurrent loop counts the
  interleaved continuations as nested updates. Deferring coalesces bursts, keeps the newest
  document, and makes the react update boundary a normal event-loop task.
- **Audit tooling stays out of the repo.** The suite needs a Chromium binary downloaded from
  npm and a stack of workarounds for the sandbox's blocked package mirrors; encoding that into
  package.json would make CI fragile for little gain now that the durable checks (45 vitest
  tests) run on every push.

## Audit trail (machines and commands)

- `npx tsc --noEmit` — clean.
- `npm test` — 45/45.
- Browser audit (dev + `vite preview` production build): 6 viewport contexts x 3 berths each,
  layout/keyboard/touch/gameplay/unlock checks — zero issues; only expected note is
  fonts.googleapis.com being unreachable from the sandbox (system-font fallback by design).
- Stress: the exact typing sequence that threw `Maximum update depth exceeded` in ~25% of runs
  now passes 20/20 iterations.

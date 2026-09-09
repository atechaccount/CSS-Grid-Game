---
name: css-grid-game
description: Build, debug, and review the Sky Dock CSS Grid learning game. Use for changes to its gameplay UI, CSS editor, responsive previews, level validation, progress handling, assets, or production build.
---

# CSS Grid Game

## Start with repository context

- Read `AGENTS.md` and the active section of `TODO.md` before implementation.
- Determine whether the task is running in Arena as directed by `AGENTS.md`.
- Inspect the working tree first and preserve unrelated user or agent changes.

## Preserve the game

- Keep the Sky Dock harbor identity, narrative voice, progression, and level content unless the task explicitly changes them.
- Preserve saved progress compatibility under the `skydock-progress-v1` local-storage key.
- Keep equivalent CSS solutions valid when they produce the correct layout; do not replace rendered-layout validation with exact answer matching.
- Preserve the public `CssEditor` contract of `value`, `onChange`, and `onRun` unless callers are updated deliberately.

## Know the implementation

- Gameplay composition is in `src/components/PlayScreen.tsx`.
- The editor is in `src/components/CssEditor.tsx`.
- Preview rendering is in `src/components/GridPreview.tsx`.
- Layout validation is in `src/engine/validate.ts` and compares player and goal element rectangles.
- Level content is split between `src/data/levels-early.ts` and `src/data/levels-late.ts` and exported through `src/data/levels.ts`.
- Production asset imports must resolve through Vite; verify actual file locations instead of relying on development-only behavior.

## Treat responsiveness as game behavior

- Keep player and goal previews in the same logical coordinate system so responsive scaling does not create false passes or failures.
- Prefer side-by-side comparison only when both docks remain readable.
- Use stacking, explicit Yours/Goal controls, or an expanded preview on constrained screens rather than clipping content.
- Check both narrow screens and short landscape or laptop screens.
- Preserve keyboard access, visible focus, readable labels, and a reachable primary check action.

## Protect the learning curve

- Describe the visual outcome in objectives instead of embedding the exact CSS answer.
- Keep first introductions explicit, then reduce scaffolding for practice, challenge, review, and boss levels.
- Order hints from conceptual cue, to likely CSS tool, to syntax-shaped help without copying the full solution.
- Treat the existing cheatsheet as the foundation for glossary and reference improvements; avoid parallel sources of truth.
- Keep glossary definitions plain-language, searchable when expanded, and unlocked consistently with chapter progress.

## Verify meaningful behavior

- Run `npm run build` after implementation.
- Exercise editing, Ctrl/Cmd + Enter, checking a correct and incorrect layout, switching previews, hints, reset, and saved drafts.
- Inspect at 1366x768, 1024x768, 768x1024, 390x844, and 360x800 when the task affects UI.
- Check keyboard-only use and 200% browser zoom for editor or layout changes.
- Report every remaining build failure, interaction defect, accessibility issue, and visible clipping problem.

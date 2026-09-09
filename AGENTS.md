# CSS-Grid-Game

Project-specific instructions. Global rules live in ~/.codex/AGENTS.md and are inherited automatically; do not repeat them here.

## Layout

## Commands

## Deployment

- The site deploys to GitHub Pages. Production is `https://atechaccount.github.io/CSS-Grid-Game/`.
- Every pull request opened from a branch in this repository gets its own preview at
  `https://atechaccount.github.io/CSS-Grid-Game/pr-preview/pr-<number>/`, posted as a comment on the
  pull request and deleted when the pull request closes.
- Open pull requests from branches in this repository, never from a fork. Fork pull requests are
  skipped on purpose, because building them with a write-enabled token is unsafe.
- Do not modify anything under `.github/`. The workflows and their two scripts are the deploy path.
- Do not change base-path handling in `vite.config.ts`. Builds read `SKYDOCK_BASE_PATH`, which the
  preview workflow sets per pull request; the default is the production path.
- Every pull request and every push to `main` runs `npx tsc --noEmit` and `npm run build` through
  `.github/workflows/verify-pull-request.yml`. Both must pass.
- Progress is saved in `localStorage` under `skydock-progress-v1`, and `localStorage` is scoped to
  the origin rather than the path. Previews therefore share saved progress with production, so treat
  a change to the progress shape as capable of corrupting real saved progress.

## Execution context

- At the start of substantial implementation work, determine whether the task is running in Arena.
- If the user or environment has not made the execution context explicit, ask the user once before implementation begins.
- In Arena, assume the agent has no access to prior conversation and treat tracked task briefs as self-contained requirements.
- Outside Arena, use `AGENTS.override.md` when present for local continuity, but never assume an online agent can read ignored files.

## Skills

- Project skills live in `.agents/skills/` and must remain repository-scoped.
- Use the `css-grid-game` skill for implementation, debugging, or review work on the game.
- Apply the `write-discoverable-code` skill whenever writing or renaming code, exported symbols, files, errors, types, or documentation attached to code.

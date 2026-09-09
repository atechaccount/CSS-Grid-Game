# CSS-Grid-Game

Project-specific instructions. Global rules live in ~/.codex/AGENTS.md and are inherited automatically; do not repeat them here.

## Layout

## Commands

## Execution context

- At the start of substantial implementation work, determine whether the task is running in Arena.
- If the user or environment has not made the execution context explicit, ask the user once before implementation begins.
- In Arena, assume the agent has no access to prior conversation and treat tracked task briefs as self-contained requirements.
- Outside Arena, use `AGENTS.override.md` when present for local continuity, but never assume an online agent can read ignored files.

## Skills

- Project skills live in `.agents/skills/` and must remain repository-scoped.
- Use the `css-grid-game` skill for implementation, debugging, or review work on the game.
- Apply the `write-discoverable-code` skill whenever writing or renaming code, exported symbols, files, errors, types, or documentation attached to code.

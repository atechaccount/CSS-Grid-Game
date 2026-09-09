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

Skills for this project live in `.agents/skills/`, which Codex, OpenCode, and Kilo all read. `.claude/skills` holds per-skill symlinks into it for Claude Code, which does not read `.agents/skills`. Add a skill in one place only; never copy it into both. A skill with a genuinely agent-specific build (different frontmatter or internal paths) gets a real directory under that agent's own path instead of a link.

At the start of substantial work here, check what is worth installing:

- `npx -y notion-axi db query d81bcca7-235a-4bfa-bd51-5f0aea32ca93 --where "Scope=Ask at start"` lists the candidates I have already formed an opinion about.
- github.com/mattpocock/skills is the upstream catalog; it is deliberately not mirrored into Notion, so check it directly for anything new.

Record a decision in the registry only when there is a judgment worth keeping (installed it, or rejected it and why). Availability alone is not a reason.

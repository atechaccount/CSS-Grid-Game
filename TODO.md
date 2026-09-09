# TODO

## Now

### Editor and responsive play-screen pass

- Before starting, determine whether this task is running in Arena and ask once if the environment does not make that clear.
- When running in Arena, assume there is no access to prior conversation; inspect the current repository, make reasonable implementation decisions, complete as much as possible end to end, and clearly report anything blocked or unfinished.
- Preserve the existing Sky Dock art direction, story, level data, validation behavior, and saved progress.
- Fix the production build first: `src/assets/art.ts` imports image files as local modules, but the files currently live in `public/images`.
- Replace the custom textarea and highlight overlay with a lightweight, production-quality CSS editor, preferably CodeMirror 6.
- Keep the existing `CssEditor` value, `onChange`, and `onRun` contract so drafts and level checks continue working.
- Include line numbers, CSS syntax highlighting, bracket matching, automatic closing brackets, indentation and outdent, undo and redo, visible focus and selection states, and Ctrl/Cmd + Enter to check.
- Keep the editor usable on touch devices and use at least a 16px input font on phones to avoid unwanted browser zoom.
- Rewrite level objectives that reveal the answer so they describe the visible result to achieve, such as matching the Goal dock, rather than naming the exact property or value to enter.
- Keep introductory teaching explicit when a concept is first introduced, but reduce scaffolding across practice, challenge, review, and boss levels.
- Make hints progressive: the first hint gives a light conceptual or directional cue, the second names the likely CSS tool, and the third gives a syntax-shaped example without copying the complete solution.
- Add a small, optional “Useful tool” reveal near the goal for players who want the relevant property name without seeing the answer.
- Turn the existing Harbor cheatsheet into a searchable glossary and reference rather than creating a duplicate screen.
- Give each glossary entry a plain-language definition, the term or property name, a compact example, and when to use it; keep entries unlocked by chapter and preserve the existing harbor voice.
- Audit a representative tutorial, practice, challenge, review, and boss level from early, middle, and late chapters to confirm the prompt and hint progression do not spoil answers or leave the goal ambiguous.
- Stop the dock previews from being cropped on narrow or short screens.
- Preserve a consistent logical board size for level validation while adapting its visual presentation to the available space.
- Keep side-by-side previews on wide screens, stack or toggle them on tablets, and show one preview at a time with an expand or full-screen option on phones.
- Keep labels readable, avoid hidden overflow that silently cuts off content, and keep the Check dock action reachable while editing.
- Account for short laptop screens as well as narrow phones, including the five-control header.
- Test at 1366x768, 1024x768, 768x1024, 390x844, and 360x800, plus keyboard-only use and 200% browser zoom.
- Run the production build after implementation and report every remaining build, interaction, accessibility, or visible layout defect.
- Keep the change focused; do not redesign unrelated screens or rewrite game content.

## Later

## Someday

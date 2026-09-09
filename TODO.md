# TODO

## Now

### Editor and responsive play-screen pass

- Preserve the existing Sky Dock art direction, story, level data, validation behavior, and saved progress.
- Fix the production build first: `src/assets/art.ts` imports image files as local modules, but the files currently live in `public/images`.
- Replace the custom textarea and highlight overlay with a lightweight, production-quality CSS editor, preferably CodeMirror 6.
- Keep the existing `CssEditor` value, `onChange`, and `onRun` contract so drafts and level checks continue working.
- Include line numbers, CSS syntax highlighting, bracket matching, automatic closing brackets, indentation and outdent, undo and redo, visible focus and selection states, and Ctrl/Cmd + Enter to check.
- Keep the editor usable on touch devices and use at least a 16px input font on phones to avoid unwanted browser zoom.
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

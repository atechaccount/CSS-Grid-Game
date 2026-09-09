import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { css } from "@codemirror/lang-css";
import {
  HighlightStyle,
  bracketMatching,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState, type Extension } from "@codemirror/state";
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef } from "react";

/**
 * Harbor-ink CSS token colors; class names match the .cm-* palette in src/index.css.
 * Tag choices follow @lezer/css: Callee (repeat, minmax) is operatorKeyword, CSS values
 * (grid, center, auto) are atom, and at-rules are definitionKeyword.
 */
const harborCssHighlight = HighlightStyle.define([
  { tag: tags.comment, class: "cm-cmt" },
  { tag: tags.string, class: "cm-str" },
  { tag: [tags.number, tags.color, tags.unit], class: "cm-num" },
  { tag: tags.propertyName, class: "cm-prop" },
  {
    tag: [tags.className, tags.tagName, tags.labelName, tags.attributeName, tags.namespace],
    class: "cm-sel",
  },
  { tag: tags.operatorKeyword, class: "cm-fn" },
  {
    tag: [tags.keyword, tags.definitionKeyword, tags.atom, tags.modifier],
    class: "cm-kw",
  },
  { tag: tags.variableName, class: "cm-var" },
  {
    tag: [tags.punctuation, tags.separator, tags.paren, tags.squareBracket, tags.brace],
    class: "cm-punc",
  },
]);

/** Shared CodeMirror setup for the play screen: line numbers, CSS tokens, brackets, undo, and Mod-Enter to check. */
function harborEditorExtensions(
  onDocumentChange: (next: string) => void,
  onRun: () => void,
): Extension[] {
  // One report slot per editor instance.
  let pendingReport = false;
  return [
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    history(),
    drawSelection(),
    indentUnit.of("  "),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    css(),
    syntaxHighlighting(harborCssHighlight),
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (!update.docChanged) return;
      // Report document changes from a macrotask, never synchronously inside the dispatch that
      // CodeMirror runs from its MutationObserver flush. During fast typing that flush
      // interleaves with React's concurrent work loop, and a setState per keystroke from inside
      // it nests until React throws "Maximum update depth exceeded". Coalescing also collapses
      // a burst of edits into one report of the latest document.
      const view = update.view;
      if (pendingReport) return;
      pendingReport = true;
      setTimeout(() => {
        pendingReport = false;
        if (!view.dom.isConnected) return; // the editor went away before the report ran
        // Read the live document: the newest edit wins, and any external change that landed
        // in between is respected rather than overwritten by a stale snapshot.
        onDocumentChange(view.state.doc.toString());
      }, 0);
    }),
    EditorView.contentAttributes.of({
      id: "css-editor",
      "aria-label": "Harbor CSS editor",
      autocapitalize: "off",
      autocorrect: "off",
      spellcheck: "false",
    }),
    keymap.of([
      { key: "Mod-Enter", preventDefault: true, run: () => (onRun(), true) },
      // Escape hands focus back to the page so keyboard-only players are never trapped by Tab.
      { key: "Escape", run: (view) => (view.contentDOM.blur(), true) },
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      indentWithTab,
    ]),
  ];
}

/**
 * CSS code editor for one berth. Keeps the original `value` / `onChange` / `onRun` contract:
 * `value` is authoritative, so Reset and level switches replace the document without remounting.
 */
export function CssEditor({
  value,
  onChange,
  onRun,
}: {
  value: string;
  onChange: (next: string) => void;
  onRun: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  // Sequence numbers for every document string this editor has emitted through onChange, plus
  // the sequence the sync effect last applied. The sync effect consults them so it never fights
  // live typing; see the effect below.
  const emittedSeqRef = useRef<Map<string, number>>(new Map([[value, 1]]));
  const appliedSeqRef = useRef(1);
  const seqRef = useRef(1);

  // Callbacks stay behind refs so the CodeMirror view is built once and never rebuilt on re-render.
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  useEffect(() => {
    onRunRef.current = onRun;
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: value,
        extensions: harborEditorExtensions(
          (next) => {
            const seq = ++seqRef.current;
            emittedSeqRef.current.set(next, seq);
            onChangeRef.current(next);
          },
          () => onRunRef.current(),
        ),
      }),
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // The view is created once per mounted editor; document changes arrive through the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const doc = view.state.doc.toString();
    if (doc === value) {
      // Settled: everything emitted so far is committed; only future edits count.
      const seq = emittedSeqRef.current.get(value) ?? ++seqRef.current;
      appliedSeqRef.current = seq;
      emittedSeqRef.current = new Map([[value, seq]]);
      return;
    }
    const valueSeq = emittedSeqRef.current.get(value);
    if (valueSeq !== undefined && valueSeq > appliedSeqRef.current) {
      // `value` is one of this editor's own edits catching up on a lagging commit (a queued
      // keystroke can beat the passive effect flush) while the doc is already further ahead.
      // Reverting would fight the typist and loop listener -> onChange -> effect until React
      // throws "Maximum update depth exceeded". The newest local edit always wins.
      return;
    }
    // Everything else is an external decision (Reset, level switch, draft restore) — including
    // a level switch back to a draft the editor emitted earlier: the parent has explicitly
    // asked for it, so it must win over the doc's current content. Replace the document.
    seqRef.current += 1;
    appliedSeqRef.current = seqRef.current;
    emittedSeqRef.current = new Map([[value, seqRef.current]]);
    view.dispatch({ changes: { from: 0, to: doc.length, insert: value } });
  }, [value]);

  return <div className="css-editor" ref={hostRef} data-editor-host="" />;
}

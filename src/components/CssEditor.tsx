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
      if (update.docChanged) onDocumentChange(update.state.doc.toString());
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
          (next) => onChangeRef.current(next),
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
    if (doc === value) return;
    view.dispatch({ changes: { from: 0, to: doc.length, insert: value } });
  }, [value]);

  return <div className="css-editor" ref={hostRef} data-editor-host="" />;
}

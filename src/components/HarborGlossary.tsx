import { useEffect, useMemo, useRef, useState } from "react";
import { harborGlossary, type GlossaryEntry } from "../data/harbor-glossary";

/** True when the search text appears in any field a player would think to type. */
function entryMatchesQuery(entry: GlossaryEntry, query: string): boolean {
  if (!query) return true;
  const haystack = `${entry.term} ${entry.title} ${entry.definition} ${entry.code} ${entry.whenToUse}`;
  return haystack.toLowerCase().includes(query.toLowerCase());
}

/**
 * Harbor glossary: searchable reference for every CSS Grid term, unlocked by shift.
 * This is the only reference screen in the game — the old cheatsheet list lives here now.
 */
export function HarborGlossary({
  unlockedChapter,
  onClose,
}: {
  unlockedChapter: number;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const unlocked = useMemo(
    () => harborGlossary.filter((e) => e.chapter <= unlockedChapter),
    [unlockedChapter],
  );
  const matches = useMemo(() => unlocked.filter((e) => entryMatchesQuery(e, query)), [unlocked, query]);
  const sealed = harborGlossary.length - unlocked.length;

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <div className="sheet-backdrop" role="dialog" aria-labelledby="sheet-title" aria-modal="true">
      <div className="sheet-panel">
        <header className="sheet-head">
          <div>
            <p className="map-kicker">Unlocked notes</p>
            <h2 id="sheet-title">Harbor glossary</h2>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="glossary-search">
          <label htmlFor="glossary-query">Search terms, properties, and examples</label>
          <input
            id="glossary-query"
            ref={searchRef}
            type="search"
            value={query}
            placeholder="minmax, gap, span…"
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="glossary-count" role="status">
            {matches.length} of {unlocked.length} entries
            {sealed > 0 ? ` · ${sealed} sealed until later shifts` : ""}
          </p>
        </div>

        {matches.length === 0 ? (
          <p className="glossary-empty">
            No entry answers to “{query}” yet. Try a property name like <code>gap</code>, or clear the
            search.
          </p>
        ) : (
          <ul className="sheet-list">
            {matches.map((e) => (
              <li key={e.id} className="sheet-item">
                <h3>{e.title}</h3>
                <p className="glossary-term">
                  <code>{e.term}</code>
                </p>
                <p className="glossary-definition">{e.definition}</p>
                <pre>
                  <code>{e.code}</code>
                </pre>
                <p className="glossary-when">
                  <strong>When to use it: </strong>
                  {e.whenToUse}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

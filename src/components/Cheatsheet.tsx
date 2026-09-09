import { cheatsheet } from "../data/cheatsheet";

export function Cheatsheet({
  unlockedChapter,
  onClose,
}: {
  unlockedChapter: number;
  onClose: () => void;
}) {
  const entries = cheatsheet.filter((e) => e.chapter <= unlockedChapter);
  return (
    <div className="sheet-backdrop" role="dialog" aria-labelledby="sheet-title">
      <div className="sheet-panel">
        <header className="sheet-head">
          <div>
            <p className="map-kicker">Unlocked notes</p>
            <h2 id="sheet-title">Harbor cheatsheet</h2>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <ul className="sheet-list">
          {entries.map((e) => (
            <li key={e.id} className="sheet-item">
              <h3>{e.title}</h3>
              <pre>
                <code>{e.code}</code>
              </pre>
              <p>{e.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

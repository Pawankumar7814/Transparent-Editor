export default function SheetSidebar({ sheets, active, onCreate, onSelect, onRemove }) {
  return (
    <aside>
      <div className="side-title">Your sheets <button className="new" onClick={onCreate}>＋</button></div>
      {sheets.map((sheet) => (
        <div className={`sheet-item ${active?.id === sheet.id ? "selected" : ""}`} key={sheet.id} onClick={() => onSelect(sheet)}>
          <span>{sheet.title}</span>
          <button onClick={(event) => { event.stopPropagation(); onRemove(sheet.id); }}>×</button>
        </div>
      ))}
      {!sheets.length && <p className="muted empty">No sheets yet.</p>}
    </aside>
  );
}

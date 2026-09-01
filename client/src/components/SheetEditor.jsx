export default function SheetEditor({ active, error, saving, onChange, onSave, onCreate }) {
  return (
    <main className="editor">
      {error && <div className="error banner">{error}</div>}
      {active ? (
        <>
          <div className="editor-head">
            <input className="title" value={active.title} onChange={(event) => onChange({ ...active, title: event.target.value })} />
            <button className="primary save" onClick={onSave}>{saving ? "Saving…" : "Save changes"}</button>
          </div>
          <textarea value={active.content} onChange={(event) => onChange({ ...active, content: event.target.value })} placeholder="Start writing something transparent…" />
        </>
      ) : (
        <div className="welcome">
          <div className="orb">◈</div>
          <h1>Make space for clear thinking.</h1>
          <p className="muted">Select a sheet or create a new one to begin.</p>
          <button className="primary" onClick={onCreate}>Create your first sheet</button>
        </div>
      )}
    </main>
  );
}

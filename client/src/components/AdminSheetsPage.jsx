import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function AdminSheetsPage({ admin, user, sheets, onBack, onLogout, theme, onToggleTheme }) {
  const [selectedSheet, setSelectedSheet] = useState(null);

  return (
    <div className="app">
      <header>
        <div className="brand">◈ Transparent Editor · Admin</div>
        <div className="account">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {admin.email}
          <button className="link" onClick={onLogout}>Sign out</button>
        </div>
      </header>
      <main className="admin-content">
        <button className="back-button" onClick={onBack}>← Back to users</button>
        <h1>Sheets for user ID: {user.id}</h1>
        <p className="muted">{user.email} · {user.phone}</p>
        <div className="admin-sheet-list">
          {sheets.length ? sheets.map((sheet) => (
            <button className="admin-sheet-link" key={sheet.id} onClick={() => setSelectedSheet(sheet)}>
              <strong>{sheet.title}</strong>
              <small>Sheet ID: {sheet.id} · Updated {new Date(sheet.updatedAt).toLocaleString()}</small>
            </button>
          )) : <p className="muted">No sheets for this user.</p>}
        </div>
        {selectedSheet && <div className="modal-backdrop" onClick={() => setSelectedSheet(null)}>
          <section className="sheet-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSheet(null)}>×</button>
            <h2>{selectedSheet.title}</h2>
            <p className="muted">Sheet ID: {selectedSheet.id} · Updated {new Date(selectedSheet.updatedAt).toLocaleString()}</p>
            <pre>{selectedSheet.content || "Empty sheet"}</pre>
          </section>
        </div>}
      </main>
    </div>
  );
}

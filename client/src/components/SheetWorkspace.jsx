import { useEffect, useState } from "react";
import { api } from "../api";
import SheetEditor from "./SheetEditor";
import SheetSidebar from "./SheetSidebar";
import ThemeToggle from "./ThemeToggle";

export default function SheetWorkspace({ user, onLogout, theme, onToggleTheme }) {
  const [sheets, setSheets] = useState([]);
  const [active, setActive] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/api/sheets").then(setSheets).catch((requestError) => setError(requestError.message));
  }, []);

  async function createSheet() {
    try {
      const sheet = await api("/api/sheets", { method: "POST", body: JSON.stringify({ title: "Untitled sheet", content: "" }) });
      setSheets((current) => [sheet, ...current]);
      setActive(sheet);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function save() {
    if (!active) return;
    setSaving(true);
    try {
      const updated = await api(`/api/sheets/${active.id}`, { method: "PATCH", body: JSON.stringify({ title: active.title, content: active.content }) });
      setSheets((current) => current.map((sheet) => sheet.id === updated.id ? updated : sheet));
      setActive(updated);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this sheet?")) return;
    try {
      await api(`/api/sheets/${id}`, { method: "DELETE" });
      setSheets((current) => current.filter((sheet) => sheet.id !== id));
      if (active?.id === id) setActive(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="app">
      <header><div className="brand">◈ Transparent Editor</div><div className="account"><ThemeToggle theme={theme} onToggle={onToggleTheme} />{user.email}<button className="link" onClick={onLogout}>Sign out</button></div></header>
      <div className="workspace">
        <SheetSidebar sheets={sheets} active={active} onCreate={createSheet} onSelect={setActive} onRemove={remove} />
        <SheetEditor active={active} error={error} saving={saving} onChange={setActive} onSave={save} onCreate={createSheet} />
      </div>
    </div>
  );
}

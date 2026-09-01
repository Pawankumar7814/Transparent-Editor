import { useEffect, useState } from "react";
import { api } from "../api";
import AdminSheetsPage from "./AdminSheetsPage";
import ThemeToggle from "./ThemeToggle";

export default function AdminDashboard({ admin, onLogout, theme, onToggleTheme, onViewSheets }) {
  const [users, setUsers] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/users", {}, "adminToken")
      .then((userData) => setUsers(userData.users))
      .catch((requestError) => {
        setError(requestError.message);
        if (/access|token|expired/i.test(requestError.message)) onLogout();
      });
  }, [onLogout]);

  async function viewUserSheets(user) {
    setError("");
    setLoadingUserId(user.id);
    try {
      const data = await api(`/api/admin/users/${user.id}/sheets`, {}, "adminToken");
      onViewSheets(user, data.sheets);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingUserId(null);
    }
  }

  return (
    <div className="app">
      <header>
        <div className="brand">◈ Transparent Editor · Admin</div>
        <div className="account"><ThemeToggle theme={theme} onToggle={onToggleTheme} />{admin.email}<button className="link" onClick={onLogout}>Sign out</button></div>
      </header>
      <main className="admin-content">
        <h1>User accounts</h1>
        {error && <div className="error banner">{error}</div>}
        <div className="admin-table">
          <div className="admin-row admin-head"><span>User ID</span><span>Email</span><span>Phone</span><span>Created</span><span>Action</span></div>
          {users.map((user) => (
            <div className="admin-row" key={user.id}>
              <span>{user.id}</span><span>{user.email}</span>
              <span>{user.phone}</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              <button className="link" onClick={() => viewUserSheets(user)} disabled={loadingUserId === user.id}>
                {loadingUserId === user.id ? "Loading..." : `View sheets (${user.sheets.length})`}
              </button>
            </div>
          ))}
        </div>
        {!users.length && !error && <p className="muted">No users found.</p>}
      </main>
    </div>
  );
}

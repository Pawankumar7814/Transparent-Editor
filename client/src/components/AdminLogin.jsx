import { useState } from "react";
import { api } from "../api";

export default function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }, "adminToken");
      localStorage.setItem("adminToken", data.token);
      onLogin(data.admin);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">◈ Transparent Editor</div>
        <h1>Admin sign in</h1>
        <p className="muted">Manage accounts securely.</p>
        <form onSubmit={submit}>
          <label>Admin ID or email<input type="text" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin or admin@example.com" /></label>
          <label>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <div className="error">{error}</div>}
          <button className="primary">Sign in</button>
        </form>
        <button className="link" onClick={onBack}>Back to user sign in</button>
      </section>
    </main>
  );
}

import { useState } from "react";
import { api } from "../api";

export default function Auth({ onAuth, onAdmin }) {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const payload = register ? { email, phone, password } : { email, password };
      const data = await api(`/api/auth/${register ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      localStorage.setItem("token", data.token);
      onAuth(data.user);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">◈ Transparent Editor</div>
        <h1>{register ? "Create your workspace" : "Welcome back"}</h1>
        <p className="muted">{register ? "Start writing with clarity." : "Sign in to your sheets."}</p>
        <form onSubmit={submit}>
          <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          {register && <label>Phone number<input type="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} /></label>}
          <label>Password<input type="password" minLength="8" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <div className="error">{error}</div>}
          <button className="primary">{register ? "Create account" : "Sign in"}</button>
        </form>
        <button className="link" onClick={() => setRegister(!register)}>
          {register ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
        <button className="link" onClick={onAdmin}>Admin sign in</button>
      </section>
    </main>
  );
}

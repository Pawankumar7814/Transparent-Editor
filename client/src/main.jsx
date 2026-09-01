import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { api } from "./api";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminSheetsPage from "./components/AdminSheetsPage";
import Auth from "./components/Auth";
import SheetWorkspace from "./components/SheetWorkspace";
import "./styles.css";
import "./theme.css";

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [adminSheetsView, setAdminSheetsView] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      api("/api/auth/me").then((data) => setUser(data.user)).catch(() => localStorage.removeItem("token"));
    }
    if (localStorage.getItem("adminToken")) setAdmin({ email: "Admin", role: "admin" });
  }, []);

  function logoutUser() {
    localStorage.removeItem("token");
    setUser(null);
  }

  function logoutAdmin() {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    setAdminMode(false);
  }

  if (adminMode && !admin) return <AdminLogin onLogin={setAdmin} onBack={() => setAdminMode(false)} />;
  if (admin && adminSheetsView) return <AdminSheetsPage admin={admin} user={adminSheetsView.user} sheets={adminSheetsView.sheets} onBack={() => setAdminSheetsView(null)} onLogout={logoutAdmin} theme={theme} onToggleTheme={toggleTheme} />;
  if (admin) return <AdminDashboard admin={admin} onLogout={logoutAdmin} theme={theme} onToggleTheme={toggleTheme} onViewSheets={(user, sheets) => setAdminSheetsView({ user, sheets })} />;
  if (!user) return <Auth onAuth={setUser} onAdmin={() => setAdminMode(true)} />;
  return <SheetWorkspace user={user} onLogout={logoutUser} theme={theme} onToggleTheme={toggleTheme} />;
}

createRoot(document.getElementById("root")).render(<App />);

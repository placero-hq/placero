import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { setRobotsMeta } from "../../lib/seo";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/jobs/new", label: "Add Job" },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setRobotsMeta(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="container-page flex items-center justify-between h-16">
          <span className="font-bold">PlaceRo Admin</span>
          <nav className="flex items-center gap-5">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `text-sm font-medium ${isActive ? "text-accent" : "text-muted hover:text-ink"}`}>
                {l.label}
              </NavLink>
            ))}
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </nav>
        </div>
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}

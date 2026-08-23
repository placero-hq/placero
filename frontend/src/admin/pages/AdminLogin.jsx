import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { setRobotsMeta } from "../../lib/seo";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRobotsMeta(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      navigate("/admin");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-md2">
        <h1 className="text-xl font-bold mb-5">PlaceRo Admin</h1>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <label className="block text-xs font-medium text-muted mb-1">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm mb-4 outline-none focus:border-accent" required />
        <label className="block text-xs font-medium text-muted mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm mb-5 outline-none focus:border-accent" required />
        <Button className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
      </form>
    </div>
  );
}

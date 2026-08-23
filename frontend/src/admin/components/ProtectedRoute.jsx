import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth();
  if (checking) return <div className="p-10 text-sm text-muted">Checking session…</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

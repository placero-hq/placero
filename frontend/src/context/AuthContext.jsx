import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { adminApi } from "../lib/adminApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const checkSession = useCallback(async () => {
    setChecking(true);
    try {
      const me = await adminApi.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { checkSession(); }, [checkSession]);

  const login = async (username, password) => {
    const me = await adminApi.login(username, password);
    setUser(me);
    return me;
  };

  const logout = async () => {
    await adminApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}

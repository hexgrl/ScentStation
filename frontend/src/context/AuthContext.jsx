import { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "";
const AuthContext = createContext(null);

export function getToken() {
  return localStorage.getItem("token");
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const token = getToken();
    if (!token) return setUser(null);
    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
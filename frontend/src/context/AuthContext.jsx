import { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
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
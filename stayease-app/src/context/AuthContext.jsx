import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

// sessionStorage: cleared when the tab/browser closes, not accessible cross-tab.
// Significantly reduces JWT theft risk vs localStorage (XSS cannot persist across sessions).
const store = sessionStorage;

export const AuthProvider = ({ children }) => {
  const [token,  setToken]  = useState(() => store.getItem("token"));
  const [role,   setRole]   = useState(() => store.getItem("role"));
  const [userId, setUserId] = useState(() => store.getItem("userId"));
  const [name,   setName]   = useState(() => store.getItem("name"));

  const login = (jwt, roleName, uid, userName) => {
    store.setItem("token",  jwt);
    store.setItem("role",   roleName);
    if (uid)      store.setItem("userId", uid);
    if (userName) store.setItem("name",   userName);
    setToken(jwt);
    setRole(roleName);
    setUserId(uid   ?? null);
    setName(userName ?? null);
  };

  const logout = () => {
    store.removeItem("token");
    store.removeItem("role");
    store.removeItem("userId");
    store.removeItem("name");
    setToken(null);
    setRole(null);
    setUserId(null);
    setName(null);
  };

  const value = useMemo(
    () => ({ token, role, userId, name, login, logout, isAuthenticated: !!token }),
    [token, role, userId, name],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

import { createContext, useContext, useMemo, useState } from "react";

// interface AuthContextType {
//   token: string | null;
//   role: string | null;
//   login: (token: string, role: string) => void;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token"),
  );
  const [role, setRole] = useState(localStorage.getItem("role"));
  const login = (jwt, roleName) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("role", roleName);
    setToken(jwt);
    setRole(roleName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  const value = useMemo(
    () => ({
      token,
      role,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [token, role],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

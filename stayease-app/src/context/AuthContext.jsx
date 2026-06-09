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
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const login = (jwt, roleName, userId) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("role", roleName);
    localStorage.setItem("userId", userId); // Store userId in localStorage
    setToken(jwt);
    setRole(roleName);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId"); // Remove userId from localStorage
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  const value = useMemo(
    () => ({
      token,
      role,
      userId,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [token, role, userId],
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

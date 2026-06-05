import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CONSTANTS from "../utils/constants";

export default function AdminRoute({ children }) {
  const { role } = useAuth();
  if (role !== CONSTANTS.ROLES.ADMIN) {
    return <Navigate to="/" replace />;
  }
  return children;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CONSTANTS from "../utils/constants";


export default function ManagerRoute({ children }) {
  const { role } = useAuth();
  if (role !== CONSTANTS.ROLES.MANAGER) {
    return <Navigate to="/" replace />;
  }
  return children;
}

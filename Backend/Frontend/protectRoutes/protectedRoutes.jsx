import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../protectRoutes/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}

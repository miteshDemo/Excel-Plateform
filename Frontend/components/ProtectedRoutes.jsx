import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  // 🚫 Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Restrict access if route requires Admin role
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allow access
  return children;
};

export default ProtectedRoute;

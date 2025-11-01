import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../Frontend/context/AuthContext";

// 🔹 Pages
import Home from "../Frontend/pages/Home";
import Register from "../Frontend/pages/Register";
import Login from "../Frontend/pages/Login";
import Dashboard from "../Frontend/pages/Dashboard";
import AdminDashboard from "../Frontend/pages/AdminDashboard";
import SuperAdminDashboard from "../Frontend/pages/SuperAdminDashboard";

// 🔹 Components
import ProtectedRoute from "../Frontend/components/ProtectedRoutes";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />

      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />

      {/* Protected User Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-dashboard"
        element={
          <ProtectedRoute>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* Redirect all unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

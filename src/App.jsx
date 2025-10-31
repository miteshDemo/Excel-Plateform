import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../Frontend/pages/Register";
import Home from "../Frontend/pages/Home";
import Login from "../Frontend/pages/Login";
import Dashboard from "../Frontend/pages/Dashboard";
import ProtectedRoute from "../Frontend/components/ProtectedRoutes";
import { useContext } from "react";
import AuthContext from "../Frontend/context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Register from "../Frontend/pages/Register";
import Login from "../Frontend/pages/Login";
import Dashboard from "../Frontend/pages/Dashboard";
import ProtectedRoute from "../Frontend/components/ProtectedRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
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

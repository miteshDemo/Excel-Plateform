import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../Frontend/context/AuthContext";
import Home from "../Frontend/pages/Home"
import Login from "../Frontend/pages/Login";
import Register from "../Frontend/pages/Register";
import UserDashboard from "../Frontend/pages/UserDashboard";
import AdminDashboard from "../Frontend/pages/AdminDashboard";
import ProtectedRoute from "../Frontend/components/ProtectedRoutes";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;

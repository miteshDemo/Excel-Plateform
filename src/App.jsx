import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../Frontend/protectRoutes/AuthContext";
import Register from "../Frontend/pages/Register";
import Login from "../Frontend/pages/Login";
import Dashboard from "../Frontend/pages/Dashboard";
import ProtectedRoute from "../Frontend/protectRoutes/protectedRoutes"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

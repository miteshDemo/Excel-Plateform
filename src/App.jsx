import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../Frontend/protectRoutes/AuthContext";
import Home from "../Frontend/pages/Home";
import Register from "../Frontend/pages/Register";
import Login from "../Frontend/pages/Login";
import Dashboard from "../Frontend/pages/Dashboard";
import Analyze from "../Frontend/pages/Analyze";
import ProtectedRoute from "../Frontend/protectRoutes/protectedRoutes"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/analyze/:id" element={
            <ProtectedRoute>
              <Analyze />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../context/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Static admin credentials
  const ADMIN_EMAIL = "admin123@gmail.com";
  const ADMIN_PASSWORD = "admin@123";

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // ✅ Login function (handles both user and admin)
  const login = async (email, password) => {
    // --- ADMIN LOGIN (no backend required)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminData = {
        name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        token: "admin-token-123", // static token
      };

      localStorage.setItem("user", JSON.stringify(adminData));
      localStorage.setItem("token", adminData.token);
      setUser(adminData);
      navigate("/admin-dashboard");
      return;
    }

    // --- NORMAL USER LOGIN (via backend)
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password");
    }
  };

  // ✅ Register new user
  const register = async (name, email, password) => {
    try {
      const { data } = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/admin-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  // ✅ Logout (works for both admin & user)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

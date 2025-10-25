import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../protectRoutes/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(data);
      } catch (error) {
        alert("Session expired. Please login again.");
        logout();
        navigate("/login");
      }
    };
    fetchProfile();
  }, [user, logout, navigate]);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Dashboard</h2>
      {profile ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      ) : <p>Loading...</p>}
      <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>
    </div>
  );
}

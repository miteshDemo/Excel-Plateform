import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <h3>Role: {user?.role}</h3>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;

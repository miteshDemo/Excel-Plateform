import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Typography, List, ListItem, ListItemText, Box, Button } from "@mui/material";

const SuperAdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data } = await axios.get("http://localhost:5000/api/superadmin/admins", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setAdmins(data);
    };
    fetchAdmins();
  }, [user]);

  return (
    <Box p={4}>
      <Typography variant="h4">Welcome, {user?.name} (Super Admin)</Typography>
      <Typography variant="h6" mt={3}>All Registered Admins:</Typography>
      <List>
        {admins.map((admin) => (
          <ListItem key={admin._id}>
            <ListItemText primary={admin.name} secondary={admin.email} />
          </ListItem>
        ))}
      </List>
      <Button onClick={logout} variant="contained" color="error" sx={{ mt: 2 }}>
        Logout
      </Button>
    </Box>
  );
};

export default SuperAdminDashboard;

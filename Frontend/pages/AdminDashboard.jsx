import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Button, Typography, Box } from "@mui/material";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Box p={4}>
      <Typography variant="h4">Welcome, {user?.name} (Admin)</Typography>
      <Typography variant="body1" mt={2}>
        You have access to Excel file management, analytics, and reports.
      </Typography>
      <Button onClick={logout} variant="contained" color="error" sx={{ mt: 3 }}>
        Logout
      </Button>
    </Box>
  );
};

export default AdminDashboard;

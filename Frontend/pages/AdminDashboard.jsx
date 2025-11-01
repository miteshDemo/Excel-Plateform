import React from "react";
import { Box, Button, Typography, AppBar, Toolbar, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear admin session
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/"); // redirect to home page
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* ✅ Top AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#107C41" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
            sx={{
              borderColor: "#fff",
              color: "#fff",
              textTransform: "none",
              borderRadius: "25px",
              "&:hover": {
                backgroundColor: "#0b662d",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* ✅ Main Content */}
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#107C41" }}>
          Welcome, Admin 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You have full access to manage users and their uploaded files.
        </Typography>

        {/* You can add cards or table here for Users / Uploads management */}
      </Container>
    </Box>
  );
};

export default AdminDashboard;

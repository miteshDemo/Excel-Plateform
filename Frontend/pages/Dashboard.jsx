import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PersonIcon from "@mui/icons-material/Person";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const bgGradient = darkMode
    ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
    : "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";

  const cardBg = darkMode
    ? "rgba(0,0,0,0.4)"
    : "rgba(255,255,255,0.15)";

  const textColor = darkMode ? "#f5f5f5" : "#ffffff";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: bgGradient,
        transition: "background 0.5s ease",
      }}
    >
      {/* ✅ AppBar */}
      <AppBar
        position="sticky"
        sx={{
          background: darkMode
            ? "rgba(0, 0, 0, 0.6)"
            : "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          transition: "background 0.5s ease",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", letterSpacing: "0.5px" }}
          >
            Excel Analytics Platform
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Toggle Dark / Light Mode">
              <IconButton color="inherit" onClick={toggleTheme}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={user?.name || "Profile"}>
              <Avatar
                sx={{
                  bgcolor: "#ffffff",
                  color: "#185a9d",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || <PersonIcon />}
              </Avatar>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ✅ Dashboard Body */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              p: 4,
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              backdropFilter: "blur(12px)",
              background: cardBg,
              border: "1px solid rgba(255,255,255,0.3)",
              color: textColor,
              textAlign: "center",
              transition: "all 0.5s ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            {/* Avatar Section */}
            <Stack alignItems="center" spacing={2} mb={3}>
              <Avatar
                sx={{
                  bgcolor: "#ffffff",
                  color: "#185a9d",
                  width: 90,
                  height: 90,
                  fontSize: "2.2rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 20px rgba(255,255,255,0.3)",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: textColor,
                  textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  transition: "color 0.5s ease",
                }}
              >
                Welcome, {user?.name || "User"} 👋
              </Typography>
            </Stack>

            {/* User Info */}
            <CardContent>
              <Stack spacing={2} sx={{ mb: 3, alignItems: "center" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <DashboardIcon />
                  <Typography variant="h6" fontWeight="500">
                    Dashboard
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <EmailIcon />
                  <Typography variant="body1">{user?.email}</Typography>
                </Stack>
              </Stack>

              {/* Buttons */}
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<LogoutIcon />}
                  onClick={logout}
                  sx={{
                    borderRadius: "25px",
                    px: 4,
                    py: 1,
                    background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #4ECDC4, #FF6B6B)",
                      transform: "scale(1.05)",
                      transition: "0.3s",
                    },
                  }}
                >
                  Logout
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate("/")}
                  sx={{
                    borderRadius: "25px",
                    px: 4,
                    py: 1,
                    borderColor: "#fff",
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      background: "rgba(255,255,255,0.2)",
                      transform: "scale(1.05)",
                      transition: "0.3s",
                    },
                  }}
                >
                  Back to Home
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.9rem",
                transition: "color 0.5s ease",
              }}
            >
              © {new Date().getFullYear()} Excel Analytics Platform |{" "}
              <strong style={{ color: "#fff" }}>@Mitesh Thakor</strong>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;

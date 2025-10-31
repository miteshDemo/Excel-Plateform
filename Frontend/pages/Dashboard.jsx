import React, { useContext, useState, useEffect } from "react";
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton as MIconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonIcon from "@mui/icons-material/Person";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const bgGradient = darkMode
    ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
    : "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";

  const cardBg = darkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.15)";
  const textColor = darkMode ? "#f5f5f5" : "#ffffff";

  // ✅ Fetch uploaded files from backend
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/uploads", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setUploads(res.data);
      } catch (err) {
        console.error("Error fetching uploads:", err);
      }
    };
    if (user) fetchUploads();
  }, [user]);

  // ✅ Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://localhost:5000/api/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setUploads((prev) => [...prev, res.data]);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/uploads/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUploads((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: bgGradient, transition: "0.5s" }}>
      {/* ✅ AppBar */}
      <AppBar
        position="sticky"
        sx={{
          background: darkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Excel Analytics Platform
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Toggle Dark / Light Mode">
              <IconButton color="inherit" onClick={toggleTheme}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={user?.name || "Profile"}>
              <Avatar sx={{ bgcolor: "#fff", color: "#185a9d", fontWeight: "bold" }}>
                {user?.name?.charAt(0).toUpperCase() || <PersonIcon />}
              </Avatar>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ✅ Dashboard Body */}
      <Container sx={{ py: 5 }}>
        <Card
          sx={{
            p: 4,
            borderRadius: "20px",
            background: cardBg,
            color: textColor,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" mb={2}>
            Welcome, {user?.name || "User"} 👋
          </Typography>
          <Typography variant="body1" mb={3}>
            {user?.email}
          </Typography>

          {/* Upload Section */}
          <form onSubmit={handleFileUpload}>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{
                  borderRadius: "25px",
                  background: "linear-gradient(45deg, #43cea2, #185a9d)",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                Select File
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  hidden
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </Button>
              {selectedFile && (
                <Typography variant="body2">{selectedFile.name}</Typography>
              )}
              <Button
                type="submit"
                variant="outlined"
                disabled={loading}
                sx={{
                  borderRadius: "25px",
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": { background: "rgba(255,255,255,0.2)" },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Upload"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.3)" }} />

          {/* Uploaded Files Section */}
          <Typography variant="h6" mb={2}>
            Uploaded Files
          </Typography>
          {uploads.length === 0 ? (
            <Typography>No files uploaded yet.</Typography>
          ) : (
            <List>
              {uploads.map((file) => (
                <ListItem
                  key={file._id}
                  sx={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    mb: 1,
                  }}
                >
                  <ListItemText primary={file.fileName} />
                  <ListItemSecondaryAction>
                    <MIconButton edge="end" color="error" onClick={() => handleDelete(file._id)}>
                      <DeleteIcon />
                    </MIconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          <Stack spacing={2} mt={3}>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                borderRadius: "25px",
                borderColor: "#fff",
                color: "#fff",
                "&:hover": { background: "rgba(255,255,255,0.2)" },
              }}
            >
              Back to Home
            </Button>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                borderRadius: "25px",
                background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;

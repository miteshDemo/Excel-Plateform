// src/pages/Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../protectRoutes/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  ListItem,
  ListItemIcon,
  Snackbar,
  Tooltip,
  Slide,
} from "@mui/material";
import {
  TableChart,
  AccountCircle,
  ExitToApp,
  CloudUpload,
  InsertDriveFile,
  Close,
  Delete,
  Download,
  Analytics,
} from "@mui/icons-material";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [profile, setProfile] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalAnalysisFiles, setTotalAnalysisFiles] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Menu & Dialog
  const [anchorEl, setAnchorEl] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  // Delete / Undo
  const [deletedFile, setDeletedFile] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const API_BASE = "http://localhost:5000/api";

  // ✅ Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.token) throw new Error("No auth token found");
        const headers = { Authorization: `Bearer ${user.token}` };

        const [
          profileRes,
          recentRes,
          countRes,
          analysisRes,
          downloadRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}/auth/profile`, { headers }),
          axios.get(`${API_BASE}/uploads/recent`, { headers }),
          axios.get(`${API_BASE}/uploads/count`, { headers }),
          axios.get(`${API_BASE}/uploads/analysis-count`, { headers }),
          axios.get(`${API_BASE}/uploads/download-count`, { headers }),
        ]);

        setProfile(profileRes.data);
        setRecentFiles(recentRes.data);
        setTotalFiles(countRes.data.total);
        setTotalAnalysisFiles(analysisRes.data.total);
        setTotalDownloads(downloadRes.data.total);
      } catch (err) {
        console.error("Dashboard Error:", err.response || err.message);
        setError("Session expired or server unavailable. Please log in again.");
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, logout, navigate]);

  // ✅ Menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  // ✅ Upload Dialog
  const handleUploadOpen = () => {
    setUploadDialogOpen(true);
    setUploadError("");
    setUploadProgress(0);
  };
  const handleUploadClose = () => {
    setUploadDialogOpen(false);
    setUploading(false);
    setUploadProgress(0);
    setUploadError("");
  };

  // ✅ Handle File Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      setUploadError("Please upload only Excel files (.xlsx, .xls)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadError("");

    try {
      const res = await axios.post(`${API_BASE}/uploads/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
        onUploadProgress: (e) =>
          setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });

      const uploadedFile = res.data.file;
      setRecentFiles((prev) => [uploadedFile, ...prev]);
      setTotalFiles((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setUploadError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete File with Undo
  const handleDeleteFile = (fileId) => {
    const fileToDelete = recentFiles.find((f) => f._id === fileId);
    setDeletedFile(fileToDelete);
    setRecentFiles((prev) => prev.filter((f) => f._id !== fileId));
    setSnackbarOpen(true);

    const timer = setTimeout(async () => {
      try {
        await axios.delete(`${API_BASE}/uploads/${fileId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } catch (err) {
        console.error("Delete failed:", err);
        setUploadError("Failed to delete file");
      }
      setDeletedFile(null);
    }, 5000);

    setUndoTimer(timer);
  };

  const handleUndoDelete = () => {
    if (undoTimer) clearTimeout(undoTimer);
    if (deletedFile) setRecentFiles((prev) => [deletedFile, ...prev]);
    setDeletedFile(null);
    setSnackbarOpen(false);
  };

  // ✅ Download File
  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const res = await axios.get(`${API_BASE}/uploads/download/${fileId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: "blob",
      });

      setTotalDownloads((prev) => prev + 1);

      const blobURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobURL;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      setUploadError("Failed to download file");
    }
  };

  // ✅ Analyze File
  const handleAnalyzeFile = (fileId) => navigate(`/analyze/${fileId}`);

  // ✅ Stats Data
  const stats = [
    { label: "Total Files", value: totalFiles, icon: <InsertDriveFile /> },
    { label: "Analyzed Files", value: totalAnalysisFiles, icon: <Analytics /> },
    { label: "Total Downloads", value: totalDownloads, icon: <Download /> },
  ];

  // ✅ Loading Screen
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* Navbar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <TableChart sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Excel Analytics Platform
          </Typography>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && <Alert severity="error">{error}</Alert>}

        {/* Welcome Banner */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #217346, #1a6ed8)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "rgba(255,255,255,0.2)" }}>
                {profile?.name?.[0]?.toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4">Welcome back, {profile?.name}!</Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage and analyze your Excel files efficiently
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={handleUploadOpen}
                sx={{
                  background: "white",
                  color: "primary.main",
                  fontWeight: "600",
                  "&:hover": { background: "#f1f1f1" },
                }}
              >
                Upload Excel File
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: "center", p: 2 }}>
                <CardContent>
                  <Box sx={{ color: "primary.main", mb: 2 }}>{stat.icon}</Box>
                  <Typography variant="h4">{stat.value}</Typography>
                  <Typography variant="body2">{stat.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Files */}
        <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
          Recent Files
        </Typography>
        <Card>
          <CardContent sx={{ p: 0 }}>
            {recentFiles.length ? (
              recentFiles.map((file) => (
                <ListItem
                  key={file._id}
                  divider
                  sx={{
                    px: 3,
                    py: 2,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon>
                    <TableChart color="primary" />
                  </ListItemIcon>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(file.createdAt).toLocaleDateString()} • {file.size}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Analyze">
                      <IconButton onClick={() => handleAnalyzeFile(file._id)}>
                        <Analytics color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton onClick={() => handleDownloadFile(file._id, file.name)}>
                        <Download color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteFile(file._id)}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Box textAlign="center" py={6}>
                <TableChart sx={{ fontSize: 48, mb: 2 }} />
                <Typography>No files uploaded yet</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* ✅ Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Upload Excel File
          <IconButton onClick={handleUploadClose} sx={{ float: "right" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {uploadError && <Alert severity="error">{uploadError}</Alert>}

          {uploading ? (
            <Box textAlign="center" py={3}>
              <CircularProgress value={uploadProgress} variant="determinate" />
              <Typography sx={{ mt: 1 }}>Uploading... {uploadProgress}%</Typography>
              <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2 }} />
            </Box>
          ) : (
            <Box
              sx={{
                border: "2px dashed #1976d2",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                bgcolor: "action.hover",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <CloudUpload sx={{ fontSize: 48, mb: 2, color: "primary.main" }} />
              <Typography>Click or drag & drop Excel file here</Typography>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                hidden
                onChange={handleFileUpload}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ Snackbar Undo */}
      <Snackbar
        open={snackbarOpen}
        message="File deleted"
        action={
          <Button color="secondary" onClick={handleUndoDelete}>
            UNDO
          </Button>
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}
      />
    </Box>
  );
}
import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Card,
  Container,
  Avatar,
  Stack,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("line");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [analysisName, setAnalysisName] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [currentFileName, setCurrentFileName] = useState("");
  const [showFileStatus, setShowFileStatus] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const chartRef = useRef();
  const threeDContainerRef = useRef();

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const bgGradient = darkMode
    ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
    : "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";

  const cardBg = darkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.15)";
  const textColor = darkMode ? "#f5f5f5" : "#ffffff";

  // ✅ Fetch Uploaded Files
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

  // ✅ Fetch Analysis History
  const fetchAnalysisHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/analysis", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setAnalysisHistory(res.data);
    } catch (err) {
      console.error("Error fetching analysis history:", err);
    }
  };

  useEffect(() => {
    if (user) fetchAnalysisHistory();
  }, [user]);

  // ✅ Manual Save Analysis with Name
  const handleSaveAnalysis = async () => {
    // Check if we have all required data
    if (!xAxis || !yAxis) {
      showSnackbar("Please select both X and Y axes first!", "warning");
      return;
    }

    if (!currentFileId && !currentFileName) {
      showSnackbar("Please upload and parse a file first!", "warning");
      return;
    }

    if (!chartData) {
      showSnackbar("No chart data available to save!", "warning");
      return;
    }

    setSaveDialogOpen(true);
  };

  const confirmSaveAnalysis = async () => {
    if (!analysisName.trim()) {
      showSnackbar("Please enter an analysis name!", "warning");
      return;
    }

    try {
      const analysisData = {
        fileId: currentFileId || null,
        fileName: currentFileName || "Unknown File",
        chartType,
        xAxis,
        yAxis,
        analysisName: analysisName.trim(),
        chartData: getChartData(),
        userId: user?.id,
      };

      console.log("Saving analysis:", analysisData);

      await axios.post(
        "http://localhost:5000/api/analysis",
        analysisData,
        { 
          headers: { 
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      showSnackbar("✅ Analysis saved successfully!", "success");
      fetchAnalysisHistory();
      setSaveDialogOpen(false);
      setAnalysisName("");
    } catch (err) {
      console.error("❌ Error saving analysis:", err.response?.data || err.message);
      showSnackbar("Failed to save analysis", "error");
    }
  };

  // ✅ Handle File Upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showSnackbar("Please select a file first!", "warning");
      return;
    }

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
      
      const uploadedFile = res.data;
      setUploads((prev) => [...prev, uploadedFile]);
      
      // Set current file info for analysis saving
      setCurrentFileId(uploadedFile._id);
      setCurrentFileName(uploadedFile.fileName);
      setShowFileStatus(true);
      
      parseFile(selectedFile, uploadedFile);
      setSelectedFile(null);
      showSnackbar("File uploaded successfully!", "success");
      
      // Hide file status after 3 seconds
      setTimeout(() => {
        setShowFileStatus(false);
      }, 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      showSnackbar("File upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Parse Excel/CSV File
  const parseFile = (file, uploadedFileInfo = null) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        
        if (json.length === 0) {
          showSnackbar("Empty or invalid file.", "warning");
          return;
        }
        
        const cols = Object.keys(json[0]);
        setColumns(cols);
        setChartData(json);
        
        // Auto-select first two columns
        if (cols.length >= 2) {
          setXAxis(cols[0]);
          setYAxis(cols[1]);
        }

        // If we have uploaded file info, set it
        if (uploadedFileInfo) {
          setCurrentFileId(uploadedFileInfo._id);
          setCurrentFileName(uploadedFileInfo.fileName);
        }

        showSnackbar("File parsed successfully! You can now configure your chart.", "success");
      } catch (err) {
        console.error("Error parsing file:", err);
        showSnackbar("Failed to parse file.", "error");
      }
    };
    reader.onerror = () => {
      showSnackbar("Error reading file.", "error");
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Reopen Visualization from Uploaded Files
  const reopenVisualizationFromFile = (file) => {
    setCurrentFileId(file._id);
    setCurrentFileName(file.fileName);
    setShowFileStatus(true);
    
    // Show file status for 3 seconds then hide
    setTimeout(() => {
      setShowFileStatus(false);
    }, 3000);
    
    // For now, we'll just set the file info and show a message
    // In a real app, you might want to reload the file data from the server
    showSnackbar(`File loaded: ${file.fileName}. Please re-upload the file to analyze it.`, "info");
  };

  // ✅ Delete Uploaded File
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/uploads/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUploads((prev) => prev.filter((u) => u._id !== id));
      
      // If current file is deleted, reset state
      if (currentFileId === id) {
        setCurrentFileId(null);
        setCurrentFileName("");
        setChartData(null);
        setColumns([]);
        setCurrentAnalysis(null);
      }
      
      showSnackbar("File deleted successfully!", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      showSnackbar("Failed to delete file", "error");
    }
  };

  // ✅ Delete Analysis Record
  const handleDeleteAnalysis = async (id) => {
    if (!window.confirm("Delete this analysis record?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/analysis/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setAnalysisHistory((prev) => prev.filter((a) => a._id !== id));
      // If current analysis is deleted, reset the view
      if (currentAnalysis && currentAnalysis._id === id) {
        setCurrentAnalysis(null);
      }
      showSnackbar("Analysis deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting analysis:", err);
      showSnackbar("Failed to delete analysis", "error");
    }
  };

  // ✅ Chart Data Generator
  const getChartData = () => {
    if (!chartData || !xAxis || !yAxis) return null;
    
    const labels = chartData.map((d) => d[xAxis]);
    const values = chartData.map((d) => parseFloat(d[yAxis]) || 0);

    const dataset = {
      label: `${yAxis} vs ${xAxis}`,
      data: values,
      backgroundColor: [
        "#FF6B6B",
        "#4ECDC4",
        "#FFD93D",
        "#1A535C",
        "#FF8C00",
        "#6A5ACD",
      ],
      borderColor: "#fff",
      borderWidth: 2,
      fill: chartType === "line" ? false : true,
    };

    if (chartType === "bar") {
      dataset.backgroundColor = "rgba(75,192,192,0.6)";
      dataset.borderColor = "rgba(75,192,192,1)";
    }

    return { labels, datasets: [dataset] };
  };

  // ✅ Download Chart as Image
  const downloadChartAsImage = () => {
    if (chartType === "3d") {
      showSnackbar("3D chart download is not supported. Please use Line, Bar, or Pie charts.", "warning");
      return;
    }

    if (chartRef.current) {
      const chartCanvas = chartRef.current.canvas;
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.png`;
      link.href = chartCanvas.toDataURL('image/png');
      link.click();
      showSnackbar("Chart downloaded successfully!", "success");
    }
  };

  // ✅ Download Chart Data as Excel
  const downloadChartData = () => {
    if (!chartData || !xAxis || !yAxis) {
      showSnackbar("No chart data available to download!", "warning");
      return;
    }

    const downloadData = chartData.map(item => ({
      [xAxis]: item[xAxis],
      [yAxis]: item[yAxis]
    }));

    const ws = XLSX.utils.json_to_sheet(downloadData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chart Data");
    XLSX.writeFile(wb, `chart-data-${Date.now()}.xlsx`);
    showSnackbar("Data downloaded successfully!", "success");
  };

  // ✅ Reopen Visualization from History
  const reopenVisualization = (analysis) => {
    setCurrentAnalysis(analysis);
    setChartType(analysis.chartType);
    setXAxis(analysis.xAxis);
    setYAxis(analysis.yAxis);
    
    // If the analysis has stored chartData, use it
    if (analysis.chartData) {
      setChartData(analysis.chartData);
      setColumns([analysis.xAxis, analysis.yAxis]);
    }
    
    // Set current file info
    if (analysis.fileId) {
      setCurrentFileId(analysis.fileId);
      setCurrentFileName(analysis.fileName);
    }
    
    // Scroll to chart section for better UX
    setTimeout(() => {
      const chartSection = document.getElementById('chart-section');
      if (chartSection) {
        chartSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    showSnackbar(`Loaded analysis: ${analysis.analysisName || "Unnamed Analysis"}`, "success");
  };

  // ✅ Clear Current Visualization
  const clearVisualization = () => {
    setCurrentAnalysis(null);
    setChartData(null);
    setColumns([]);
    setXAxis("");
    setYAxis("");
    setChartType("line");
    setCurrentFileId(null);
    setCurrentFileName("");
    showSnackbar("Analysis cleared. Ready for new analysis.", "info");
  };

  // ✅ Close Visualization (just hide the chart, keep data)
  const closeVisualization = () => {
    setChartData(null);
    setColumns([]);
    setXAxis("");
    setYAxis("");
    setChartType("line");
    showSnackbar("Visualization closed. Data is still available.", "info");
  };

  // ✅ 3D Bar Visualization
  const ThreeDChart = ({ data, xKey, yKey }) => {
    const groupRef = useRef();
    const bars = useMemo(() => {
      if (!data || !xKey || !yKey) return [];
      return data.map((d, i) => ({
        x: i * 1.5,
        height: parseFloat(d[yKey]) || 0,
        label: d[xKey],
      }));
    }, [data, xKey, yKey]);

    const colors = ["#FF6B6B", "#FFD93D", "#4ECDC4", "#6A5ACD", "#FF8C00"];

    return (
      <Canvas
        camera={{ position: [8, 8, 12], fov: 45 }}
        style={{ height: "450px", background: "rgba(10,15,30,0.95)" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.3} />
        <OrbitControls enableZoom enablePan />
        <gridHelper args={[30, 30, "#555", "#333"]} />
        <group ref={groupRef} position={[-(bars.length / 2), 0, 0]}>
          {bars.map((bar, i) => (
            <mesh key={i} position={[bar.x, bar.height / 2, 0]}>
              <boxGeometry args={[1, bar.height, 1]} />
              <meshStandardMaterial
                color={colors[i % colors.length]}
                roughness={0.3}
                metalness={0.2}
              />
              <Text
                position={[bar.x, bar.height + 0.4, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
              >
                {bar.label}
              </Text>
            </mesh>
          ))}
        </group>
      </Canvas>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", background: bgGradient, transition: "0.5s" }}>
      {/* Navbar */}
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

      {/* Main Section */}
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

          {/* Current Analysis Info */}
          {currentAnalysis && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <VisibilityIcon color="primary" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {currentAnalysis.analysisName || "Unnamed Analysis"}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={0.5}>
                      <Chip 
                        label={`Type: ${currentAnalysis.chartType}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ color: '#4ECDC4', borderColor: '#4ECDC4' }}
                      />
                      <Chip 
                        label={`X: ${currentAnalysis.xAxis}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ color: '#FFD93D', borderColor: '#FFD93D' }}
                      />
                      <Chip 
                        label={`Y: ${currentAnalysis.yAxis}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ color: '#FF6B6B', borderColor: '#FF6B6B' }}
                      />
                    </Stack>
                  </Box>
                </Stack>
                <Button
                  startIcon={<ReplayIcon />}
                  onClick={clearVisualization}
                  variant="outlined"
                  sx={{
                    color: '#fff',
                    borderColor: '#fff',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  New Analysis
                </Button>
              </Stack>
            </Box>
          )}

          {/* File Status - Shows for 3 seconds then hides */}
          {showFileStatus && currentFileName && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
              <Typography variant="body2">
                📊 Current File: <strong>{currentFileName}</strong>
                {currentFileId && ` (ID: ${currentFileId})`}
              </Typography>
            </Box>
          )}

          {/* Upload Section */}
          <form onSubmit={handleFileUpload}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{
                  borderRadius: "25px",
                  background: "linear-gradient(45deg, #43cea2, #185a9d)",
                  "&:hover": { transform: "scale(1.05)" },
                  mb: { xs: 1, sm: 0 }
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
                <Typography variant="body2" sx={{ mb: { xs: 1, sm: 0 } }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}
              <Button
                type="submit"
                variant="outlined"
                disabled={loading || !selectedFile}
                sx={{
                  borderRadius: "25px",
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": { background: "rgba(255,255,255,0.2)" },
                  mb: { xs: 1, sm: 0 }
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Upload & Parse"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.3)" }} />

          {/* Uploaded Files */}
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
                    background: currentFileId === file._id 
                      ? "rgba(78, 205, 196, 0.2)" 
                      : "rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    mb: 1,
                    border: currentFileId === file._id ? '2px solid #4ECDC4' : 'none',
                  }}
                >
                  <ListItemText 
                    primary={file.fileName} 
                    secondary={`Click to reopen this file`}
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Reopen Visualization">
                        <IconButton
                          onClick={() => reopenVisualizationFromFile(file)}
                          sx={{
                            color: '#4ECDC4',
                            '&:hover': { bgcolor: 'rgba(78, 205, 196, 0.1)' }
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete File">
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDelete(file._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          {/* Chart Controls */}
          {columns.length > 0 && (
            <>
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Chart Configuration
                  </Typography>
                  {getChartData() && (
                    <Tooltip title="Close Visualization">
                      <Button
                        startIcon={<CloseIcon />}
                        onClick={closeVisualization}
                        variant="outlined"
                        size="small"
                        sx={{
                          color: '#FF6B6B',
                          borderColor: '#FF6B6B',
                          '&:hover': { 
                            bgcolor: 'rgba(255,107,107,0.1)',
                            borderColor: '#FF6B6B'
                          }
                        }}
                      >
                        Close Visualization
                      </Button>
                    </Tooltip>
                  )}
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  my={3}
                  flexWrap="wrap"
                >
                  <FormControl sx={{ minWidth: 120, mb: { xs: 2, sm: 0 } }}>
                    <InputLabel sx={{ color: "#fff" }}>X-Axis</InputLabel>
                    <Select
                      value={xAxis}
                      label="X-Axis"
                      onChange={(e) => setXAxis(e.target.value)}
                      sx={{ color: "#fff" }}
                    >
                      {columns.map((col) => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120, mb: { xs: 2, sm: 0 } }}>
                    <InputLabel sx={{ color: "#fff" }}>Y-Axis</InputLabel>
                    <Select
                      value={yAxis}
                      label="Y-Axis"
                      onChange={(e) => setYAxis(e.target.value)}
                      sx={{ color: "#fff" }}
                    >
                      {columns.map((col) => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 150, mb: { xs: 2, sm: 0 } }}>
                    <InputLabel sx={{ color: "#fff" }}>Chart Type</InputLabel>
                    <Select
                      value={chartType}
                      label="Chart Type"
                      onChange={(e) => setChartType(e.target.value)}
                      sx={{ color: "#fff" }}
                    >
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="bar">Bar Chart</MenuItem>
                      <MenuItem value="pie">Pie Chart</MenuItem>
                      <MenuItem value="3d">3D Chart</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                {/* Chart Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="center" mb={3} flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveAnalysis}
                    disabled={!xAxis || !yAxis}
                    sx={{
                      borderRadius: "25px",
                      background: "linear-gradient(45deg, #FF6B6B, #FFD93D)",
                      mb: { xs: 1, sm: 0 }
                    }}
                  >
                    Save Analysis
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadChartAsImage}
                    disabled={!getChartData()}
                    sx={{
                      borderRadius: "25px",
                      background: "linear-gradient(45deg, #4ECDC4, #1A535C)",
                      mb: { xs: 1, sm: 0 }
                    }}
                  >
                    Download Chart
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadChartData}
                    disabled={!chartData}
                    sx={{
                      borderRadius: "25px",
                      background: "linear-gradient(45deg, #6A5ACD, #FF8C00)",
                      mb: { xs: 1, sm: 0 }
                    }}
                  >
                    Download Data
                  </Button>
                </Stack>
              </Box>
            </>
          )}

          {/* Chart Rendering */}
          {getChartData() && (
            <Box 
              id="chart-section"
              sx={{ mt: 4, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2, p: 2 }}
            >
              <Typography variant="h6" mb={2}>
                Visualization
              </Typography>
              {chartType === "line" && <Line ref={chartRef} data={getChartData()} />}
              {chartType === "bar" && <Bar ref={chartRef} data={getChartData()} />}
              {chartType === "pie" && <Pie ref={chartRef} data={getChartData()} />}
              {chartType === "3d" && (
                <ThreeDChart data={chartData} xKey={xAxis} yKey={yAxis} />
              )}
            </Box>
          )}

          {/* Analysis History */}
          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.3)" }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <HistoryIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Analysis History
            </Typography>
          </Box>
          {analysisHistory.length === 0 ? (
            <Typography>No analyses yet.</Typography>
          ) : (
            <List>
              {analysisHistory.map((item) => (
                <ListItem
                  key={item._id}
                  sx={{
                    background: currentAnalysis?._id === item._id 
                      ? "rgba(78, 205, 196, 0.2)" 
                      : "rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    mb: 1,
                    border: currentAnalysis?._id === item._id ? '2px solid #4ECDC4' : 'none',
                    '&:hover': {
                      background: currentAnalysis?._id === item._id 
                        ? "rgba(78, 205, 196, 0.3)" 
                        : "rgba(255,255,255,0.2)",
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.analysisName || "Unnamed Analysis"}
                        </Typography>
                        {currentAnalysis?._id === item._id && (
                          <Chip 
                            label="Currently Viewing" 
                            size="small" 
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    }
                    secondary={`${item.fileName} - ${item.xAxis} vs ${item.yAxis} (${item.chartType})`}
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Reopen Visualization">
                        <IconButton
                          onClick={() => reopenVisualization(item)}
                          sx={{
                            color: '#4ECDC4',
                            '&:hover': { bgcolor: 'rgba(78, 205, 196, 0.1)' }
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Analysis">
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteAnalysis(item._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          {/* Buttons */}
          <Stack spacing={2} mt={4}>
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

      {/* Save Analysis Dialog */}
      <Dialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)}
        PaperProps={{
          sx: {
            background: darkMode ? '#1e3c72' : '#43cea2',
            color: '#fff'
          }
        }}
      >
        <DialogTitle>Save Analysis</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Analysis Name"
            type="text"
            fullWidth
            variant="outlined"
            value={analysisName}
            onChange={(e) => setAnalysisName(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#fff',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setSaveDialogOpen(false)}
            sx={{ color: '#fff' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmSaveAnalysis}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #FF6B6B, #FFD93D)",
              color: '#fff'
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
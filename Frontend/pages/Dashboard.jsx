import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Box, Button, Card, Container,
  Avatar, Stack, Tooltip, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton as MIconButton, Divider, CircularProgress, FormControl,
  InputLabel, Select, MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonIcon from "@mui/icons-material/Person";
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
import * as THREE from "three";

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
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("line");

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const bgGradient = darkMode
    ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
    : "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";

  const cardBg = darkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.15)";
  const textColor = darkMode ? "#f5f5f5" : "#ffffff";

  // ✅ Fetch uploaded files
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

  // ✅ Handle File Upload
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
      parseFile(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Parse Excel/CSV
  const parseFile = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      if (json.length === 0) return;
      const cols = Object.keys(json[0]);
      setColumns(cols);
      setChartData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Delete File
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

  // ✅ Chart Data for Line, Bar & Pie
  const getChartData = () => {
    if (!chartData || !xAxis || !yAxis) return null;
    const labels = chartData.map((d) => d[xAxis]);
    const values = chartData.map((d) => parseFloat(d[yAxis]));

    const baseDataset = {
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
      baseDataset.backgroundColor = "rgba(75,192,192,0.6)";
      baseDataset.borderColor = "rgba(75,192,192,1)";
    }

    return {
      labels,
      datasets: [baseDataset],
    };
  };

  // ✅ 3D Bar Chart — Render actual Excel Data
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

        <gridHelper args={[30, 30, "#555", "#333"]} position={[0, 0, 0]} />

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
              {selectedFile && <Typography variant="body2">{selectedFile.name}</Typography>}
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

          {columns.length > 1 && (
            <Stack direction="row" spacing={2} justifyContent="center" my={3} flexWrap="wrap">
              <FormControl sx={{ minWidth: 120 }}>
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
              <FormControl sx={{ minWidth: 120 }}>
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
              <FormControl sx={{ minWidth: 150 }}>
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
          )}

          {getChartData() && (
            <Box sx={{ mt: 4, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2, p: 2 }}>
              {chartType === "line" && <Line data={getChartData()} />}
              {chartType === "bar" && <Bar data={getChartData()} />}
              {chartType === "pie" && <Pie data={getChartData()} />}
              {chartType === "3d" && <ThreeDChart data={chartData} xKey={xAxis} yKey={yAxis} />}
            </Box>
          )}

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
    </Box>
  );
};

export default Dashboard;

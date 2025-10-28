import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../protectRoutes/AuthContext";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert,
  Container,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  BarChart,
  ThreeDRotation,
  TableChart,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export default function Analyze() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!user?.token) {
        setError("Unauthorized: Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/analyze/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAnalysis(res.data);
        setOpenSnackbar(true);
      } catch (err) {
        console.error("❌ Analyze fetch error:", err);
        if (err.response) {
          setError(err.response.data.message || "Failed to analyze file.");
        } else if (err.request) {
          setError("Server not responding. Check backend connection.");
        } else {
          setError("Unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id, user?.token]);

  const COLORS = ["#217346", "#1a6ed8", "#ff6b35", "#6a1b9a", "#2e7d32"];
  const safeData = analysis || {
    fileName: "",
    sheetNames: [],
    chartData: [],
    columnStats: [],
  };

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">Analyzing your Excel file...</Typography>
      </Box>
    );

  if (error && !analysis)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{ ml: 2 }}
          variant="contained"
          color="primary"
        >
          Go Back
        </Button>
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          File analysis completed successfully!
        </Alert>
      </Snackbar>

      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #217346 0%, #1a6ed8 100%)"
              : "linear-gradient(135deg, #2e7d32 0%, #42a5f5 100%)",
          color: "white",
        }}
      >
        <Box sx={{ mb: isSmall ? 2 : 0 }}>
          <Typography variant="h5" fontWeight="600">
            {safeData.fileName || "Untitled File"}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Sheet: {safeData.sheetNames?.[0] || "N/A"}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard")}
          sx={{ borderColor: "white", color: "white" }}
        >
          Back
        </Button>
      </Paper>

      {/* Main Visualization Grid */}
      <Grid container spacing={4}>
        {/* Column Stats */}
        <Grid item xs={12}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                <TableChart color="primary" /> Column Statistics
              </Typography>

              {safeData.columnStats?.length ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Column Name</b></TableCell>
                      <TableCell><b>Type</b></TableCell>
                      <TableCell><b>Unique Values</b></TableCell>
                      <TableCell><b>Empty Cells</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {safeData.columnStats.map((col, index) => (
                      <TableRow key={index}>
                        <TableCell>{col.name}</TableCell>
                        <TableCell>{col.type}</TableCell>
                        <TableCell>{col.unique}</TableCell>
                        <TableCell>{col.empty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  No column statistics available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 2D Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                <BarChart color="primary" /> 2D Data Visualization
              </Typography>

              {safeData.chartData?.length ? (
                <Box sx={{ height: isSmall ? 250 : 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={safeData.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill={theme.palette.primary.main}
                        radius={[5, 5, 0, 0]}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No chart data available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ✅ Pie Chart Visualization */}
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                <PieChartIcon color="secondary" /> Pie Chart Visualization
              </Typography>

              {safeData.chartData?.length ? (
                <Box sx={{ height: isSmall ? 250 : 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={safeData.chartData}
                        dataKey="count"
                        nameKey="name"
                        outerRadius={isSmall ? 80 : 130}
                        label
                      >
                        {safeData.chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No chart data available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 3D Visualization */}
        <Grid item xs={12}>
          <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                <ThreeDRotation color="secondary" /> 3D Data Visualization
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: isSmall ? 250 : 400,
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Canvas>
                  <PerspectiveCamera makeDefault position={[3, 3, 5]} />
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <OrbitControls />
                  {safeData.chartData?.map((item, index) => {
                    const x = index * 1.2 - 3;
                    const height = Math.max(item.count / 10, 0.2);
                    return (
                      <mesh key={index} position={[x, height / 2 - 1, 0]}>
                        <boxGeometry args={[0.8, height, 0.8]} />
                        <meshStandardMaterial
                          color={COLORS[index % COLORS.length]}
                        />
                      </mesh>
                    );
                  })}
                </Canvas>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

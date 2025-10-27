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
import { ArrowBack, BarChart, ThreeDRotation, TableChart } from "@mui/icons-material";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
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
      try {
        const res = await axios.get(`http://localhost:5000/api/analyze/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAnalysis(res.data);
        setOpenSnackbar(true);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze file");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id, user.token]);

  const COLORS = ["#217346", "#1a6ed8", "#ff6b35", "#6a1b9a", "#2e7d32"];
  const safeData = analysis || { fileName: "", chartData: [], columnStats: [] };

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
        }}
      >
        <Alert severity="error">{error}</Alert>
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
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          File analysis completed successfully!
        </Alert>
      </Snackbar>

      {/* File Info */}
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
          background: "linear-gradient(135deg, #217346 0%, #1a6ed8 100%)",
          color: "white",
        }}
      >
        <Box sx={{ mb: isSmall ? 2 : 0 }}>
          <Typography variant="h5" fontWeight="600">
            {safeData.fileName}
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

      {/* Visualization Section */}
      <Grid container spacing={4}>
        {/* Column Stats Table */}
        <Grid item xs={12}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: 600 }}
              >
                <TableChart color="primary" /> Column Statistics
              </Typography>
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
                  {safeData.columnStats?.map((col, index) => (
                    <TableRow key={index}>
                      <TableCell>{col.name}</TableCell>
                      <TableCell>{col.type}</TableCell>
                      <TableCell>{col.unique}</TableCell>
                      <TableCell>{col.empty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* 2D Visualization */}
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: 600 }}
              >
                <BarChart color="primary" /> 2D Data Visualization
              </Typography>
              <Box sx={{ height: isSmall ? 250 : 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={safeData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#217346" radius={[5, 5, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 3D Visualization */}
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: 600 }}
              >
                <ThreeDRotation color="secondary" /> 3D Data Visualization
              </Typography>

              <Box sx={{ width: "100%", height: isSmall ? 250 : 400, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                <Canvas>
                  <PerspectiveCamera makeDefault position={[3, 3, 5]} />
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <OrbitControls />
                  {safeData.chartData?.map((item, index) => {
                    const x = index * 1.2 - 3;
                    const height = item.count / 10;
                    return (
                      <mesh key={index} position={[x, height / 2 - 1, 0]}>
                        <boxGeometry args={[0.8, height, 0.8]} />
                        <meshStandardMaterial color={COLORS[index % COLORS.length]} />
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

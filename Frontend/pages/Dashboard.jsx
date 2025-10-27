import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../protectRoutes/AuthContext";
import { useNavigate } from "react-router-dom";
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
  Divider,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  TableChart,
  AccountCircle,
  ExitToApp,
  Analytics,
  Share,
  CloudDownload,
  TrendingUp,
  Group,
  Security,
} from "@mui/icons-material";


export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(data);
      } catch (error) {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, logout, navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const quickActions = [
    {
      icon: <TableChart sx={{ fontSize: 40 }} />,
      title: "New Spreadsheet",
      description: "Create a new spreadsheet",
      color: "#217346",
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: "Data Analysis",
      description: "Analyze your data",
      color: "#1a6ed8",
    },
    {
      icon: <Share sx={{ fontSize: 40 }} />,
      title: "Share",
      description: "Share with team",
      color: "#ff6b35",
    },
    {
      icon: <CloudDownload sx={{ fontSize: 40 }} />,
      title: "Export",
      description: "Export your data",
      color: "#6a1b9a",
    },
  ];

  const stats = [
    { label: "Spreadsheets", value: "12", icon: <TableChart /> },
    { label: "Shared Files", value: "8", icon: <Group /> },
    { label: "Storage Used", value: "2.4 GB", icon: <CloudDownload /> },
    { label: "Team Members", value: "5", icon: <Security /> },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: "primary.main", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Navigation Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <TableChart sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Excel Platform
          </Typography>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Welcome Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #217346 0%, #1a6ed8 100%)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontSize: "2rem",
                }}
              >
                {profile?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom fontWeight="600">
                Welcome back, {profile?.name}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Ready to create some amazing spreadsheets?
              </Typography>
            </Grid>
            <Grid item>
              <TrendingUp sx={{ fontSize: 60, opacity: 0.8 }} />
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Box
                    sx={{
                      color: "primary.main",
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="600" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Quick Actions */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Box sx={{ color: action.color, mb: 2 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Profile Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              Profile Information
            </Typography>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Full Name
                  </Typography>
                  <Typography variant="h6" fontWeight="500">
                    {profile?.name}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Email Address
                  </Typography>
                  <Typography variant="h6" fontWeight="500">
                    {profile?.email}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Member Since
                  </Typography>
                  <Typography variant="h6" fontWeight="500">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ExitToApp />}
                  onClick={handleLogout}
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "600",
                  }}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
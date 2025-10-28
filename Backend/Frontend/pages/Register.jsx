import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../protectRoutes/AuthContext";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  TableChart,
  ArrowBack,
  Home, // Home icon
} from "@mui/icons-material";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );
      login(data);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "#217346",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        margin: 0,
      }}
    >
      <Fade in timeout={800}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            position: "relative",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              color: "white",
            }}
          >
            <TableChart sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" component="h1" fontWeight="600">
              Excel Platform
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{ mb: 3, textAlign: "center", color: "white" }}
          >
            Create your account
          </Typography>

          <Paper
            elevation={8}
            sx={{
              padding: 3,
              width: "100%",
              borderRadius: 2,
              background: "white",
              position: "relative",
            }}
          >
            {/* Home Icon inside the form - Alternative position */}
            <IconButton
              onClick={handleGoHome}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                color: "primary.main",
                backgroundColor: "rgba(33, 115, 70, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(33, 115, 70, 0.2)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease-in-out",
              }}
              aria-label="Go back to home page"
            >
              <Home fontSize="small" />
            </IconButton>

            <Typography
              component="h2"
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "600",
                color: "primary.main",
                mb: 2,
              }}
            >
              Sign Up
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, fontSize: "0.875rem" }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={loading}
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: "600",
                  background:
                    "linear-gradient(135deg, #217346 0%, #1a6ed8 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1a5a38 0%, #1557b7 100%)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "grey.400",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "secondary.main",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>                
              </Box>
            </Box>
          </Paper>

          {/* Compact Features Preview */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}
          >
            <Box sx={{ textAlign: "center", color: "white" }}>
              <TableChart sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography
                variant="caption"
                fontWeight="500"
                sx={{ color: "white" }}
              >
                Spreadsheets
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", color: "white" }}>
              <Email sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography
                variant="caption"
                fontWeight="500"
                sx={{ color: "white" }}
              >
                Collaborate
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", color: "white" }}>
              <Lock sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography
                variant="caption"
                fontWeight="500"
                sx={{ color: "white" }}
              >
                Secure
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

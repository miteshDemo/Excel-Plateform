import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { VpnKeyOutlined } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Simulated Auth Context
const useAuth = () => ({
  login: (data) => console.log("Simulating login with data:", data),
});

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate ? useNavigate() : () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockData = { token: "fake-jwt", user: { email, name: "User" } };

      login(mockData);
      setFeedback({
        type: "success",
        message: "Login successful! Redirecting to dashboard...",
      });

      setTimeout(() => {
        setLoading(false);
        console.log("Redirecting to dashboard...");
      }, 2000);
    } catch (err) {
      setFeedback({
        type: "error",
        message: "Invalid email or password. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(to right, #f7fafc, #e8f5e9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Card
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          overflow: "hidden",
          mx: "auto",
          py: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.01)" },
        }}
      >
        <CardContent sx={{ px: isMobile ? 3 : 5 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <VpnKeyOutlined
              sx={{
                fontSize: 48,
                color: "#107C41",
                mb: 1,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="text.primary"
              gutterBottom
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Log in to access your Excel Platform dashboard.
            </Typography>
          </Box>

          {/* Feedback */}
          {feedback && (
            <Alert severity={feedback.type} sx={{ mb: 3 }}>
              {feedback.message}
            </Alert>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              variant="outlined"
              size="medium"
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              variant="outlined"
              size="medium"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.4,
                fontWeight: "bold",
                textTransform: "none",
                backgroundColor: "#107C41",
                color: "#fff",
                "&:hover": { backgroundColor: "#0e6939" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don’t have an account?{" "}
              <Button
                href="/register"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#107C41",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Register
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;

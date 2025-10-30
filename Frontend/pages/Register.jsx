import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PersonAddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const navigate = useNavigate();

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate delay

      setFeedback({
        type: "success",
        message: "Registration successful! Redirecting to login...",
      });

      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setFeedback({
        type: "error",
        message: "Registration failed. Please check your details.",
      });
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9 0%, #f5f7fa 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          transform: "translateY(0)",
          transition: "all 0.3s ease",
          "&:hover": { transform: "translateY(-3px)" },
        }}
      >
        <CardContent sx={{ p: isMobile ? 3 : 5 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <PersonAddOutlined sx={{ fontSize: 48, color: "#107C41", mb: 1 }} />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="text.primary"
              gutterBottom
            >
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start mastering your data with Excel Platform.
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
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
              required
              variant="outlined"
              size="medium"
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              fullWidth
              required
              variant="outlined"
              size="medium"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleFormChange}
              fullWidth
              required
              variant="outlined"
              size="medium"
            />
            <FormControl fullWidth>
              <InputLabel>Account Type</InputLabel>
              <Select
                value={form.role}
                label="Account Type"
                name="role"
                onChange={handleFormChange}
              >
                <MenuItem value="user">User (Data Analyst)</MenuItem>
                <MenuItem value="admin">Admin (Team Manager)</MenuItem>
              </Select>
            </FormControl>

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
                "&:hover": { backgroundColor: "#0e6939" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register Account"
              )}
            </Button>
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Button
                href="/login"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#107C41",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegistrationPage;

import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const ADMIN_EMAIL = "admin123@gmail.com";
  const ADMIN_PASSWORD = "admin@123";

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form.email, form.password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#107C41",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
              sx={{ color: "#107C41" }}
            >
              Already User..!
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
              mb={3}
            >
              Login to your account
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                variant="outlined"
                margin="normal"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  backgroundColor: "#107C41",
                  borderRadius: "25px",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": { backgroundColor: "#0b662d" },
                }}
              >
                Login
              </Button>

              <Typography textAlign="center" mt={3}>
                Don’t have an account?{" "}
                <Link
                  onClick={() => navigate("/register")}
                  sx={{
                    cursor: "pointer",
                    color: "#107C41",
                    fontWeight: "bold",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Register here
                </Link>
              </Typography>
            </form>

            {/* 👇 Back to Home Button */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  borderColor: "#107C41",
                  color: "#107C41",
                  borderRadius: "25px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#e8f5e9",
                    borderColor: "#0b662d",
                  },
                }}
              >
                Back to Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;

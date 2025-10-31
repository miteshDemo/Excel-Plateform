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
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // 👈 Back icon

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form.name, form.email, form.password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "grey",
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
              sx={{
                color: "#424242",
              }}
            >
              New User..!
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
              mb={3}
            >
              Sign up to access your Excel Platform
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
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
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  backgroundColor: "#424242",
                  borderRadius: "25px",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#2e2e2e",
                  },
                }}
              >
                Sign Up
              </Button>

              <Typography textAlign="center" mt={3}>
                Already have an account?{" "}
                <Link
                  onClick={() => navigate("/login")}
                  sx={{
                    cursor: "pointer",
                    color: "#424242",
                    fontWeight: "bold",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </form>

            {/* 👇 Back to Home Button (Same as Login.jsx) */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  borderColor: "#424242",
                  color: "#424242",
                  borderRadius: "25px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#2e2e2e",
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

export default Register;

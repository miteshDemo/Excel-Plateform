import React from "react";
import { Box, Button, Container, Grid, Typography, Card, CardContent, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SpeedIcon from "@mui/icons-material/Speed";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CloudUploadIcon sx={{ fontSize: 48, color: "#ffffff" }} />,
      title: "Easy Upload",
      description: "Drag & drop Excel files"
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48, color: "#ffffff" }} />,
      title: "Smart Analysis",
      description: "Find hidden patterns"
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: "#ffffff" }} />,
      title: "Fast Processing",
      description: "Lightning-fast results"
    }
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
        }
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
          animation: "float 4s ease-in-out infinite 1s",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Main Content - Centered */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #ffffff, #e3f2fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: { xs: "2.5rem", md: "3rem" },
              mb: 3
            }}
          >
            Excel Analytics Plateform
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: "rgba(255,255,255,0.9)", 
              mb: 4,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              lineHeight: 1.6,
              maxWidth: "600px",
              mx: "auto"
            }}
          >
            Transform your Excel data into powerful insights. Upload, analyze, and visualize your spreadsheets effortlessly.
          </Typography>
        </Box>

        {/* Feature Cards - Centered */}
        <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "16px",
                  color: "white",
                  transition: "all 0.3s ease",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    background: "rgba(255,255,255,0.2)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                  }
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", fontSize: "1.2rem" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontSize: "0.95rem" }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Box 
          sx={{ 
            width: "100px", 
            height: "3px", 
            background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
            mx: "auto",
            mb: 4 
          }} 
        />

        {/* CTA Button - Centered */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: "30px",
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
              boxShadow: "0 8px 25px rgba(78, 205, 196, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #4ECDC4, #FF6B6B)",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 35px rgba(78, 205, 196, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
            endIcon={<InsertChartOutlinedIcon />}
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
            p: 3,
            mt: 6,
            textAlign: "center"
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: "rgba(255,255,255,0.8)",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Developed by <strong style={{ color: "#ffffff" }}>@mitesh Thakor</strong>
          </Typography>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </Box>
  );
};

export default Home;
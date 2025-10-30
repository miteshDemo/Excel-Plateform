import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// Using Material UI Icons for a modern look
import {
  AssessmentOutlined,
  CloudUploadOutlined,
  FlashOnOutlined,
  HomeOutlined,
  LoginOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      icon: AssessmentOutlined,
      title: "Advanced Visualization",
      desc: "Turn raw data into interactive charts, dashboards, and custom reports instantly.",
    },
    {
      icon: CloudUploadOutlined,
      title: "Secure Data Upload",
      desc: "Upload Excel (.xlsx) and CSV files quickly for secure, automated processing.",
    },
    {
      icon: FlashOnOutlined,
      title: "AI-Powered Insights",
      desc: "Get accurate, AI-driven analysis and smart data summaries in seconds.",
    },
  ];

  const FeatureCard = ({ icon: Icon, title, desc }) => (
    <Card
      elevation={6}
      sx={{
        p: isMobile ? 2 : 3,
        borderRadius: 4, // More rounded corners
        transition: "0.3s",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid #e0e0e0",
        // Excel-like color hover effect (subtle green background)
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[12],
          backgroundColor: "rgba(16, 124, 65, 0.05)", // Subtle green tint
        },
      }}
    >
      <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
        <Icon sx={{ fontSize: 50, color: "#107C41", mb: 2 }} />
        <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
          {title}
        </Typography>
        <Typography color="text.secondary">
          {desc}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Navbar */}
      <AppBar position="sticky" color="default" elevation={2}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", height: 70 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Excel<span style={{ color: "#107C41" }}>Analyzer</span>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button href="/" color="primary" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <HomeOutlined sx={{ mr: 0.5 }} /> Home
              </Button>
              <Button href="/register" variant="contained" color="success" sx={{ 
                  textTransform: 'none', 
                  boxShadow: 3, 
                  '&:hover': { backgroundColor: '#0e6939' } 
                }}>
                <PersonAddOutlined sx={{ mr: 0.5 }} /> Register
              </Button>
              <Button href="/login" variant="outlined" color="primary" sx={{ 
                  textTransform: 'none', 
                  display: { xs: 'none', md: 'flex' } 
                }}>
                <LoginOutlined sx={{ mr: 0.5 }} /> Login
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ py: { xs: 8, md: 15 } }}>
        <Grid
          container
          spacing={5}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={6}>
            <Typography 
              variant={isMobile ? "h4" : "h2"} 
              fontWeight="extrabold" 
              gutterBottom
              sx={{ lineHeight: 1.2, mb: 3 }}
            >
              Master Your{" "}
              <Typography
                component="span"
                color="#107C41" // Excel Green
                fontWeight="extrabold"
              >
                Data Workflow
              </Typography>{" "}
              with the Intelligent Platform
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h5"} 
              color="text.secondary" 
              paragraph
              sx={{ mb: 4 }}
            >
              Upload large files, run complex analysis, and generate interactive, shareable dashboards. Designed for speed and enterprise security.
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
              <Button
                href="/register"
                variant="contained"
                size="large"
                color="primary"
                sx={{ py: 1.5, px: 4, textTransform: 'none', fontWeight: 'bold' }}
              >
                Start Free Trial
              </Button>
              <Button href="/login" variant="outlined" size="large" color="primary" sx={{ py: 1.5, px: 4, textTransform: 'none' }}>
                View Demo
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} textAlign="center">
            <Box
              component="img"
              src="https://placehold.co/800x600/1976d2/ffffff?text=Data+Dashboard+Visualization"
              alt="Excel Visualization Mockup"
              sx={{
                width: "100%",
                maxWidth: 600,
                height: 'auto',
                borderRadius: 4,
                boxShadow: theme.shadows[20],
                border: '8px solid #fff',
                objectFit: 'cover'
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: "#fff", py: { xs: 10, md: 15 } }}>
        <Container>
          <Box textAlign="center" mb={8}>
            <Typography variant="h6" color="#107C41" fontWeight="bold" gutterBottom>
              CAPABILITIES
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              Unleash the Power of Your Spreadsheets
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "#1976d2", py: { xs: 8, md: 10 }, color: 'white', mt: 0 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h2" fontWeight="bold" mb={2}>
            Join the Next Generation of Data Analysis
          </Typography>
          <Typography variant="h6" mb={4} color="#bbdefb">
            Start transforming your raw data into actionable intelligence today. No credit card required.
          </Typography>
          <Button
            href="/register"
            variant="contained"
            size="large"
            color="success" // Accent green button on blue background
            sx={{ py: 1.5, px: 6, fontSize: '1.1rem', fontWeight: 'bold', boxShadow: 6, textTransform: 'none' }}
          >
            Create Your Free Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          textAlign: "center",
          bgcolor: "#212121",
          color: 'white',
          borderTop: "1px solid #424242",
        }}
      >
        <Container>
          <Typography variant="body2" color="gray.400" sx={{ mb: 1 }}>
            © {new Date().getFullYear()} ExcelAnalyzer. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <a href="#" style={{ color: '#9e9e9e', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#9e9e9e', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: '#9e9e9e', textDecoration: 'none' }}>Contact</a>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

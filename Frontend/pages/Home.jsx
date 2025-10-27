import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fab,
  useScrollTrigger,
  Zoom,
  Fade,
} from '@mui/material';
import {
  TableChart,
  Analytics,
  Security,
  Dashboard,
  CloudUpload,
  AutoGraph,
  Group, // Replaces Collaboration
  KeyboardArrowUp,
  Share, // Alternative for collaboration
  Cloud,
  Speed,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#217346', // Excel-like green
    },
    secondary: {
      main: '#1a6ed8', // Excel-like blue
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
});

// Scroll to top component
function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor'
    );
    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TableChart sx={{ fontSize: 40 }} />,
      title: 'Advanced Spreadsheets',
      description: 'Create, edit, and collaborate on spreadsheets with powerful formulas and functions.',
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Data Analysis',
      description: 'Perform complex data analysis with built-in tools and visualization capabilities.',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Storage',
      description: 'Your data is securely stored in the cloud with enterprise-grade security.',
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />, // Changed from Collaboration
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time on the same spreadsheet.',
    },
    {
      icon: <Dashboard sx={{ fontSize: 40 }} />,
      title: 'Interactive Dashboards',
      description: 'Create stunning dashboards and reports with your spreadsheet data.',
    },
    {
      icon: <AutoGraph sx={{ fontSize: 40 }} />,
      title: 'Advanced Charts',
      description: 'Visualize your data with a wide variety of chart types and customization options.',
    },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Navigation Bar */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <TableChart sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Excel Platform
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
            <Button 
              variant="contained" 
              onClick={handleRegister}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 3
              }}
            >
              Sign Up Free
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box id="back-to-top-anchor">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography 
                    variant="h1" 
                    gutterBottom 
                    sx={{ 
                      color: 'primary.main',
                      fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                  >
                    Powerful Spreadsheets
                    <br />
                    <Typography 
                      component="span" 
                      variant="h1" 
                      sx={{ 
                        color: 'secondary.main',
                        fontSize: { xs: '2.5rem', md: '3.5rem' }
                      }}
                    >
                      Made Simple
                    </Typography>
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    paragraph 
                    sx={{ mb: 4, fontSize: '1.2rem' }}
                  >
                    Create, collaborate, and analyze data with our advanced Excel platform. 
                    Everything you need to turn your data into insights.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={handleRegister}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem'
                      }}
                    >
                      Get Started Free
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      onClick={handleLogin}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem'
                      }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #217346 0%, #1a6ed8 100%)',
                    color: 'white',
                    borderRadius: 4,
                    minHeight: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <TableChart sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                      Excel Platform
                    </Typography>
                    <Typography variant="h6">
                      All your spreadsheet needs in one place
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            Powerful Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in timeout={(index + 1) * 300}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <Box sx={{ color: 'primary.main', mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Paper
            elevation={4}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #217346 0%, #1a6ed8 100%)',
              color: 'white',
              borderRadius: 4,
            }}
          >
            <Typography variant="h3" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of users who trust our platform for their spreadsheet needs.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleRegister}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  }
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleLogin}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Sign In to Account
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TableChart sx={{ mr: 1 }} />
                <Typography variant="h6">Excel Platform</Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                Powerful spreadsheet tools for modern businesses and individuals. 
                Create, analyze, and collaborate like never before.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Get Started
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  onClick={handleRegister}
                  size="small"
                >
                  Sign Up
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleLogin}
                  size="small"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Typography 
            variant="body2" 
            color="grey.400" 
            align="center" 
            sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'grey.800' }}
          >
            © 2025 Excel Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Scroll to top button */}
      <ScrollTop>
        <Fab color="primary" size="medium" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </ThemeProvider>
  );
};

export default HomePage;
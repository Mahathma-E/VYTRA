import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Container,
  Card,
  CardContent,
  Grid
} from '@mui/material';

const RouteTest = () => {
  const navigate = useNavigate();

  const routes = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/inventory', label: 'Inventory' },
    { path: '/suppliers', label: 'Suppliers' },
    { path: '/reports', label: 'Reports' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/profile', label: 'Profile' },
    { path: '/settings', label: 'Settings' },
    { path: '/role-test', label: 'Role Test' }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Route Testing
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Test navigation to all available routes
        </Typography>
        
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available Routes
            </Typography>
            <Grid container spacing={2}>
              {routes.map((route, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleNavigate(route.path)}
                  >
                    {route.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            Note: Some routes may require specific user roles to access.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RouteTest;
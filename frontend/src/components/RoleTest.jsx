import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Box, Button, ButtonGroup, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RoleTest = () => {
  const { user, simulateRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    simulateRole(role);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Please log in to test roles
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Role Testing
        </Typography>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current User Information
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> {user.role}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Simulate Different Roles
          </Typography>
          <ButtonGroup variant="outlined" aria-label="role selection">
            <Button 
              onClick={() => handleRoleChange('employee')}
              variant={user.role === 'employee' ? 'contained' : 'outlined'}
            >
              Employee
            </Button>
            <Button 
              onClick={() => handleRoleChange('manager')}
              variant={user.role === 'manager' ? 'contained' : 'outlined'}
            >
              Manager
            </Button>
            <Button 
              onClick={() => handleRoleChange('admin')}
              variant={user.role === 'admin' ? 'contained' : 'outlined'}
            >
              Admin
            </Button>
          </ButtonGroup>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Test Navigation
          </Typography>
          <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap' }}>
            <Button onClick={() => handleNavigate('/dashboard')}>Dashboard</Button>
            <Button onClick={() => handleNavigate('/products')}>Products</Button>
            <Button onClick={() => handleNavigate('/inventory')}>Inventory</Button>
            <Button onClick={() => handleNavigate('/users')}>Users</Button>
            <Button onClick={() => handleNavigate('/analytics')}>Analytics</Button>
            <Button onClick={() => handleNavigate('/alerts')}>Alerts</Button>
          </ButtonGroup>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            Note: This role simulation is for testing purposes only. In a real application, 
            roles are determined by the backend and cannot be changed on the frontend.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RoleTest;
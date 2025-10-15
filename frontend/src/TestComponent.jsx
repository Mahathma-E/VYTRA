import React from 'react';
import { useAuth } from './context/AuthContext';
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAccessibleRoutes, getRoleDescription } from './utils/roleUtils';

const TestComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const accessibleRoutes = user ? getAccessibleRoutes(user.role) : [];

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          User Information
        </Typography>
        
        {user ? (
          <>
            <Typography variant="body1" gutterBottom>
              <strong>User ID:</strong> {user._id}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Role:</strong> {user.role}
            </Typography>
            <Typography variant="body2" gutterBottom color="textSecondary">
              {getRoleDescription(user.role)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}
            </Typography>
            
            {user.profile && (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>First Name:</strong> {user.profile.firstName || 'Not set'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Last Name:</strong> {user.profile.lastName || 'Not set'}
                </Typography>
              </>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Accessible Routes:
              </Typography>
              <List dense>
                {accessibleRoutes.map((route, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={route.path} 
                      secondary={route.allowedRoles.length > 0 ? `Requires: ${route.allowedRoles.join(' or ')}` : 'Available to all users'}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/dashboard')}
                sx={{ mr: 2 }}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body1">
            No user data available. Please log in.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default TestComponent;
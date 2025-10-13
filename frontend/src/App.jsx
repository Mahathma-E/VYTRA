import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { indigo, pink } from '@mui/material/colors';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProductList from './components/products/ProductList';
import InventoryList from './components/inventory/InventoryList';
import UserList from './components/users/UserList';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import AlertsList from './components/alerts/AlertsList';
import ProtectedRoute from './components/ProtectedRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <ProductList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <InventoryList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alert" 
            element={
              <ProtectedRoute>
                <AlertsList />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
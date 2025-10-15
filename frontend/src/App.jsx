import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

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
import TestComponent from './TestComponent';
import RoleTest from './components/RoleTest';
import RouteTest from './components/RouteTest';
import SuppliersList from './components/SuppliersList';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Reports from './components/Reports';
import ExcelImport from './components/ExcelImport';
import DataAnalysis from './components/DataAnalysis';
import DataManipulation from './components/DataManipulation';

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <AnimatedRoutes />
      </Router>
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          <Route path="/test" element={<TestComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/role-test" 
            element={
              <ProtectedRoute>
                <RoleTest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/route-test" 
            element={
              <ProtectedRoute>
                <RouteTest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Login />} 
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
            path="/alerts" 
            element={
              <ProtectedRoute>
                <AlertsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/suppliers" 
            element={
              <ProtectedRoute>
                <SuppliersList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/excel-import" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <ExcelImport />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data-analysis" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <DataAnalysis />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data-manipulation" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <DataManipulation />
              </ProtectedRoute>
            } 
          />

      </Routes>
    </AnimatePresence>
  );
}

export default App;
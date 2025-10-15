import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  CircularProgress
} from '@mui/material';
import { useCurrency } from '../../context/CurrencyContext';
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  Warning,
  People,
  Category,
  LocalShipping
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardContent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Mock data for demonstration
  const mockDashboardData = {
    kpis: {
      totalProducts: 124,
      totalInventoryValue: 125000,
      lowStockItems: 8,
      recentSales: 42,
      totalUsers: 24,
      pendingOrders: 5
    },
    salesTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Sales Value',
          data: [12000, 19000, 15000, 18000, 22000, 25000],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    },
    inventoryTrend: {
      labels: ['Electronics', 'Furniture', 'Clothing', 'Books'],
      datasets: [
        {
          label: 'Stock Levels',
          data: [45, 32, 28, 19],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  };

  useEffect(() => {
    // In a real app, you would fetch dashboard data from an API
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Render role-specific dashboard content
  const renderDashboardForRole = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminDashboard data={dashboardData} />;
      case 'manager':
        return <ManagerDashboard data={dashboardData} />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <GeneralDashboard />;
    }
  };

  return (
    <Box>
      {renderDashboardForRole()}
    </Box>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ data }) => {
  const { formatCurrency } = useCurrency();
  
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4">
                    {data.kpis.totalProducts}
                  </Typography>
                </Box>
                <Category color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Inventory Value
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(data.kpis.totalInventoryValue)}
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    System Users
                  </Typography>
                  <Typography variant="h4">
                    {data.kpis.totalUsers}
                  </Typography>
                </Box>
                <People color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Sales Trend" />
            <CardContent>
              <Line data={data.salesTrend} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Inventory by Category" />
            <CardContent>
              <Bar data={data.inventoryTrend} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Manager Dashboard Component
const ManagerDashboard = ({ data }) => {
  const { formatCurrency } = useCurrency();
  
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4">
                    {data.kpis.lowStockItems}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Recent Sales
                  </Typography>
                  <Typography variant="h4">
                    {data.kpis.recentSales}
                  </Typography>
                </Box>
                <ShoppingCart color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Orders
                  </Typography>
                  <Typography variant="h4">
                    {data.kpis.pendingOrders}
                  </Typography>
                </Box>
                <LocalShipping color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Team Performance" />
            <CardContent>
              <Typography variant="body1">
                Your team has processed {data.kpis.recentSales} sales this month.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label="On Track" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Inventory Alerts" />
            <CardContent>
              <Typography variant="body1">
                {data.kpis.lowStockItems} items are below reorder point.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label="Action Required" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Employee Dashboard Component
const EmployeeDashboard = () => {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Daily Tasks
                  </Typography>
                  <Typography variant="h4">
                    5
                  </Typography>
                </Box>
                <Inventory color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4">
                    3
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4">
                    2
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Today's Assignments" />
            <CardContent>
              <Typography variant="body1">
                1. Stock receiving - Electronics section
              </Typography>
              <Typography variant="body1">
                2. Inventory check - Warehouse A
              </Typography>
              <Typography variant="body1">
                3. Price update - New products
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Typography variant="body1">
                • Adjust stock levels
              </Typography>
              <Typography variant="body1">
                • Transfer items between locations
              </Typography>
              <Typography variant="body1">
                • Report damaged goods
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// General Dashboard Component (fallback)
const GeneralDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to AIIS
      </Typography>
      <Typography variant="body1">
        Please select a section from the navigation menu to get started.
      </Typography>
    </Box>
  );
};

export default DashboardContent;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  Warning
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

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockDashboardMetrics = {
    totalProducts: 124,
    totalInventoryValue: 125000,
    lowStockItems: 8,
    recentSales: {
      count: 42,
      totalValue: 32500,
      totalQuantity: 128
    }
  };

  const salesTrendData = {
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
  };

  const inventoryTrendData = {
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
  };

  useEffect(() => {
    // In a real app, you would fetch dashboard metrics from an API
    setTimeout(() => {
      setDashboardMetrics(mockDashboardMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4">
                    {dashboardMetrics.totalProducts}
                  </Typography>
                </Box>
                <Inventory color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Inventory Value
                  </Typography>
                  <Typography variant="h4">
                    ${dashboardMetrics.totalInventoryValue.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4">
                    {dashboardMetrics.lowStockItems}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Recent Sales
                  </Typography>
                  <Typography variant="h4">
                    {dashboardMetrics.recentSales.count}
                  </Typography>
                  <Typography variant="body2">
                    ${dashboardMetrics.recentSales.totalValue.toLocaleString()}
                  </Typography>
                </Box>
                <ShoppingCart color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Sales Trends" />
          <Tab label="Inventory Trends" />
          <Tab label="ABC Analysis" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Sales Trends (Last 6 Months)
              </Typography>
              <Line data={salesTrendData} />
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Inventory by Category
              </Typography>
              <Bar data={inventoryTrendData} />
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                ABC Analysis
              </Typography>
              <Box display="flex" justifyContent="center">
                <Chip label="A Items: High Value, Low Volume" color="error" sx={{ m: 1 }} />
                <Chip label="B Items: Medium Value, Medium Volume" color="warning" sx={{ m: 1 }} />
                <Chip label="C Items: Low Value, High Volume" color="success" sx={{ m: 1 }} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography>
                  A items represent 20% of products but 80% of value
                </Typography>
                <Typography>
                  B items represent 30% of products and 15% of value
                </Typography>
                <Typography>
                  C items represent 50% of products and 5% of value
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Forecast Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Demand Forecast
        </Typography>
        <Typography variant="body1" paragraph>
          Based on historical data, the system predicts the following demand for the next 7 days:
        </Typography>
        <Grid container spacing={2}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Grid item xs={6} sm={4} md={2} key={day}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{day}</Typography>
                  <Typography variant="h4">{Math.floor(Math.random() * 50) + 20}</Typography>
                  <Typography variant="body2">units</Typography>
                  <Chip 
                    label={`${Math.floor(Math.random() * 20) + 80}% confidence`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default AnalyticsDashboard;
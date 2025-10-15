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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  Warning,
  FilterList,
  LocationOn,
  Category,
  CalendarToday,
  Refresh
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
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

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
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [viewMode, setViewMode] = useState('overview');

  // Mock data for demonstration
  const mockDashboardMetrics = {
    totalProducts: 124,
    totalInventoryValue: 125000,
    lowStockItems: 8,
    recentSales: {
      count: 42,
      totalValue: 32500,
      totalQuantity: 128
    },
    kpiData: {
      inventoryTurnover: 4.2,
      stockoutRate: 2.1,
      fillRate: 97.8,
      obsoleteInventory: 3.5
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

  // Heatmap data for inventory levels
  const heatmapData = {
    labels: ['Store 1', 'Store 2', 'Store 3', 'Warehouse A', 'Warehouse B'],
    datasets: [
      {
        label: 'Electronics',
        data: [85, 72, 90, 65, 78],
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      },
      {
        label: 'Furniture',
        data: [45, 52, 38, 62, 55],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      },
      {
        label: 'Clothing',
        data: [75, 82, 68, 92, 88],
        backgroundColor: 'rgba(255, 206, 86, 0.6)'
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

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
        <Typography variant="h4">VYTRA Analytics Dashboard</Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="subtitle1">Filters:</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Location</InputLabel>
              <Select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                label="Location"
                startAdornment={<LocationOn sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Locations</MenuItem>
                <MenuItem value="store1">Store 1</MenuItem>
                <MenuItem value="store2">Store 2</MenuItem>
                <MenuItem value="warehouse-a">Warehouse A</MenuItem>
                <MenuItem value="warehouse-b">Warehouse B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
                startAdornment={<Category sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="furniture">Furniture</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="books">Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
                startAdornment={<CalendarToday sx={{ mr: 1 }} />}
              >
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
                <MenuItem value="1y">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newView) => setViewMode(newView)}
              size="small"
            >
              <ToggleButton value="overview">Overview</ToggleButton>
              <ToggleButton value="detailed">Detailed</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

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
        
        {/* Additional KPIs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Inventory Turnover
                  </Typography>
                  <Typography variant="h4">
                    {dashboardMetrics.kpiData.inventoryTurnover}x
                  </Typography>
                </Box>
                <Refresh color="primary" sx={{ fontSize: 40 }} />
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
                    Stockout Rate
                  </Typography>
                  <Typography variant="h4">
                    {dashboardMetrics.kpiData.stockoutRate}%
                  </Typography>
                </Box>
                <Warning color="error" sx={{ fontSize: 40 }} />
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
                    Fill Rate
                  </Typography>
                  <Typography variant="h4">
                    {dashboardMetrics.kpiData.fillRate}%
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
                    Obsolete Inventory
                  </Typography>
                  <Typography variant="h4">
                    {dashboardMetrics.kpiData.obsoleteInventory}%
                  </Typography>
                </Box>
                <Inventory color="warning" sx={{ fontSize: 40 }} />
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
          <Tab label="Location Heatmap" />
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
          
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Inventory Levels by Location
              </Typography>
              <Bar data={heatmapData} options={{ indexAxis: 'y' }} />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Forecast Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
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

      {/* Replenishment Recommendations */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Replenishment Recommendations
        </Typography>
        <Typography variant="body1" paragraph>
          Based on current inventory levels and forecasted demand, the following items require attention:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Immediate Action Required" />
              <CardContent>
                <Typography variant="body2">
                  • Product ID: ELEC-001 - Electronics Component A (Reorder in 2 days)
                </Typography>
                <Typography variant="body2">
                  • Product ID: FURN-045 - Office Chair B (Stock level critical)
                </Typography>
                <Typography variant="body2">
                  • Product ID: CLOTH-123 - Summer T-Shirt (High demand forecast)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Planned Reorders" />
              <CardContent>
                <Typography variant="body2">
                  • Product ID: BOOK-078 - Bestseller Novel (Scheduled for next week)
                </Typography>
                <Typography variant="body2">
                  • Product ID: ELEC-034 - Smartphone Charger (Monthly reorder)
                </Typography>
                <Typography variant="body2">
                  • Product ID: FURN-067 - Desk Lamp (Seasonal restock)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AnalyticsDashboard;
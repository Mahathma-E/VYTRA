import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  Assessment as AssessmentIcon,
  TrendingUp,
  Inventory,
  ShoppingCart,
  Warning
} from '@mui/icons-material';

const Reports = () => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('summary');

  // Mock report data
  const inventoryReportData = [
    { id: 1, sku: 'ELEC-001', name: 'Smartphone Charger', category: 'Electronics', currentStock: 45, minStock: 20, status: 'adequate' },
    { id: 2, sku: 'FURN-045', name: 'Office Chair', category: 'Furniture', currentStock: 8, minStock: 15, status: 'low' },
    { id: 3, sku: 'CLOTH-123', name: 'Summer T-Shirt', category: 'Clothing', currentStock: 120, minStock: 50, status: 'adequate' },
    { id: 4, sku: 'BOOK-078', name: 'Bestseller Novel', category: 'Books', currentStock: 32, minStock: 25, status: 'adequate' },
    { id: 5, sku: 'ELEC-034', name: 'Bluetooth Headphones', category: 'Electronics', currentStock: 5, minStock: 10, status: 'critical' }
  ];

  const salesReportData = [
    { id: 1, date: '2023-06-01', product: 'Smartphone Charger', quantity: 15, revenue: 225, location: 'Store 1' },
    { id: 2, date: '2023-06-01', product: 'Office Chair', quantity: 2, revenue: 400, location: 'Store 2' },
    { id: 3, date: '2023-06-02', product: 'Summer T-Shirt', quantity: 25, revenue: 500, location: 'Store 1' },
    { id: 4, date: '2023-06-02', product: 'Bestseller Novel', quantity: 8, revenue: 160, location: 'Store 3' },
    { id: 5, date: '2023-06-03', product: 'Bluetooth Headphones', quantity: 5, revenue: 750, location: 'Store 1' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'error';
      case 'low': return 'warning';
      case 'adequate': return 'success';
      default: return 'default';
    }
  };

  const handleGenerateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = (format) => {
    alert(`Exporting report as ${format.toUpperCase()}`);
  };

  const renderInventoryReport = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Current Stock</TableCell>
            <TableCell>Minimum Stock</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryReportData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.currentStock}</TableCell>
              <TableCell>{item.minStock}</TableCell>
              <TableCell>
                <Chip 
                  label={item.status} 
                  color={getStatusColor(item.status)} 
                  size="small" 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderSalesReport = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Revenue</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesReportData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.product}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.revenue}</TableCell>
              <TableCell>{item.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Generate and export detailed inventory and sales reports
          </Typography>
        </Grid>

        {/* Report Controls */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Report Parameters" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      label="Report Type"
                    >
                      <MenuItem value="inventory">Inventory Report</MenuItem>
                      <MenuItem value="sales">Sales Report</MenuItem>
                      <MenuItem value="performance">Performance Report</MenuItem>
                      <MenuItem value="supplier">Supplier Report</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Date Range</InputLabel>
                    <Select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      label="Date Range"
                    >
                      <MenuItem value="7d">Last 7 Days</MenuItem>
                      <MenuItem value="30d">Last 30 Days</MenuItem>
                      <MenuItem value="90d">Last 90 Days</MenuItem>
                      <MenuItem value="1y">Last Year</MenuItem>
                      <MenuItem value="custom">Custom Range</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    startIcon={<AssessmentIcon />}
                    onClick={handleGenerateReport}
                    disabled={loading}
                    fullWidth
                    sx={{ height: '100%' }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Generate Report'}
                  </Button>
                </Grid>
              </Grid>
              
              {dateRange === 'custom' && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Report View Options */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => setViewMode(newMode)}
            >
              <ToggleButton value="summary">Summary</ToggleButton>
              <ToggleButton value="detailed">Detailed</ToggleButton>
              <ToggleButton value="chart">Chart View</ToggleButton>
            </ToggleButtonGroup>
            
            <Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('pdf')}
                sx={{ mr: 1 }}
              >
                Export PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('excel')}
                sx={{ mr: 1 }}
              >
                Export Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Report Content */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
              subheader={`Showing data for the last ${dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : dateRange === '90d' ? '90 days' : 'year'}`}
            />
            <CardContent>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {reportType === 'inventory' && renderInventoryReport()}
                  {reportType === 'sales' && renderSalesReport()}
                  {reportType === 'performance' && (
                    <Typography>Performance report content would be displayed here.</Typography>
                  )}
                  {reportType === 'supplier' && (
                    <Typography>Supplier report content would be displayed here.</Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Report Summary */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Items
                      </Typography>
                      <Typography variant="h4">
                        {reportType === 'inventory' ? inventoryReportData.length : salesReportData.length}
                      </Typography>
                    </Box>
                    <Inventory color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Value
                      </Typography>
                      <Typography variant="h4">
                        {reportType === 'inventory' ? '$125,450' : '$2,125'}
                      </Typography>
                    </Box>
                    <TrendingUp color="success" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Low Stock
                      </Typography>
                      <Typography variant="h4">
                        {reportType === 'inventory' ? '2' : 'N/A'}
                      </Typography>
                    </Box>
                    <Warning color="warning" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Critical Items
                      </Typography>
                      <Typography variant="h4">
                        {reportType === 'inventory' ? '1' : 'N/A'}
                      </Typography>
                    </Box>
                    <Warning color="error" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  DeliveryDining,
  LocalShipping,
  Schedule,
  CheckCircle
} from '@mui/icons-material';

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock supplier data
  const mockSuppliers = [
    {
      id: 1,
      name: 'TechGlobal Supplies',
      contact: 'John Smith',
      email: 'john@techglobal.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, San Francisco, CA',
      products: 42,
      status: 'active',
      lastDelivery: '2023-06-15',
      nextDelivery: '2023-07-05',
      performance: 95
    },
    {
      id: 2,
      name: 'Prime Distribution',
      contact: 'Sarah Johnson',
      email: 'sarah@primedist.com',
      phone: '+1 (555) 987-6543',
      address: '456 Distribution Ave, New York, NY',
      products: 28,
      status: 'active',
      lastDelivery: '2023-06-18',
      nextDelivery: '2023-07-02',
      performance: 88
    },
    {
      id: 3,
      name: 'Quality Goods Inc',
      contact: 'Michael Brown',
      email: 'michael@qualitygoods.com',
      phone: '+1 (555) 456-7890',
      address: '789 Quality Blvd, Chicago, IL',
      products: 15,
      status: 'delayed',
      lastDelivery: '2023-05-28',
      nextDelivery: '2023-07-10',
      performance: 72
    },
    {
      id: 4,
      name: 'Express Logistics',
      contact: 'Emily Davis',
      email: 'emily@expresslog.com',
      phone: '+1 (555) 234-5678',
      address: '321 Express Way, Los Angeles, CA',
      products: 36,
      status: 'active',
      lastDelivery: '2023-06-20',
      nextDelivery: '2023-06-30',
      performance: 92
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSuppliers(mockSuppliers);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'delayed': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'delayed': return <Schedule />;
      default: return <LocalShipping />;
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? supplier.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Supplier Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage supplier relationships and track delivery performance
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Supplier Overview"
              subheader="Track supplier performance and delivery schedules"
              action={
                <Button variant="contained" startIcon={<AddIcon />}>
                  Add Supplier
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Search suppliers"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: <SearchIcon />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="delayed">Delayed</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Products</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Delivery</TableCell>
                      <TableCell>Next Delivery</TableCell>
                      <TableCell>Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{supplier.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {supplier.address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{supplier.contact}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {supplier.email}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {supplier.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={`${supplier.products} items`} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(supplier.status)}
                            label={supplier.status}
                            color={getStatusColor(supplier.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{supplier.lastDelivery}</TableCell>
                        <TableCell>
                          <Chip
                            icon={<DeliveryDining />}
                            label={supplier.nextDelivery}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${supplier.performance}%`}
                            color={supplier.performance > 80 ? 'success' : supplier.performance > 60 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuppliersList;
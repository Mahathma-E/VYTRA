import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  SwapHoriz as TransferIcon,
  TrendingUp as AdjustmentIcon,
  TrendingDown as OutIcon
} from '@mui/icons-material';
import { useSocket } from '../../context/SocketContext';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'adjustment', 'transfer', 'out'
  const [selectedItem, setSelectedItem] = useState(null);
  const socket = useSocket();

  // Mock data for demonstration
  const mockInventory = [
    {
      id: 1,
      product: 'Laptop',
      sku: 'LAP-001',
      location: 'Warehouse A',
      currentStock: 25,
      reservedStock: 5,
      availableStock: 20,
      reorderPoint: 10,
      status: 'active'
    },
    {
      id: 2,
      product: 'Desk Chair',
      sku: 'CHR-002',
      location: 'Warehouse B',
      currentStock: 15,
      reservedStock: 2,
      availableStock: 13,
      reorderPoint: 5,
      status: 'active'
    },
    {
      id: 3,
      product: 'Monitor',
      sku: 'MON-003',
      location: 'Store 1',
      currentStock: 8,
      reservedStock: 1,
      availableStock: 7,
      reorderPoint: 10,
      status: 'low'
    },
    {
      id: 4,
      product: 'Keyboard',
      sku: 'KEY-004',
      location: 'Warehouse A',
      currentStock: 50,
      reservedStock: 5,
      availableStock: 45,
      reorderPoint: 20,
      status: 'active'
    }
  ];

  const locations = ['All', 'Warehouse A', 'Warehouse B', 'Store 1', 'Store 2'];

  useEffect(() => {
    // In a real app, you would fetch inventory from an API
    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('inventoryUpdated', (data) => {
        // Update inventory list with new data
        setSnackbar({
          open: true,
          message: `Inventory updated for ${data.product}`,
          severity: 'success'
        });
        
        // In a real app, you would update the specific item in the list
        console.log('Inventory updated:', data);
      });

      return () => {
        socket.off('inventoryUpdated');
      };
    }
  }, [socket]);

  useEffect(() => {
    let filtered = inventory;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locationFilter && locationFilter !== 'All') {
      filtered = filtered.filter(item => item.location === locationFilter);
    }
    
    setFilteredInventory(filtered);
  }, [searchTerm, locationFilter, inventory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'low':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Inventory</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AdjustmentIcon />}
            onClick={() => handleOpenDialog('adjustment')}
            sx={{ mr: 1 }}
          >
            Adjust Stock
          </Button>
          <Button
            variant="contained"
            startIcon={<TransferIcon />}
            onClick={() => handleOpenDialog('transfer')}
            sx={{ mr: 1 }}
          >
            Transfer Stock
          </Button>
          <Button
            variant="contained"
            startIcon={<OutIcon />}
            onClick={() => handleOpenDialog('out')}
          >
            Stock Out
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search inventory"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={locationFilter}
                label="Location"
                onChange={handleLocationChange}
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Reserved</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Reorder Point</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.reservedStock}</TableCell>
                <TableCell>{item.availableStock}</TableCell>
                <TableCell>{item.reorderPoint}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    color={getStatusColor(item.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Adjust Stock">
                    <IconButton onClick={() => handleOpenDialog('adjustment', item)}>
                      <AdjustmentIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Transfer Stock">
                    <IconButton onClick={() => handleOpenDialog('transfer', item)}>
                      <TransferIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Stock Out">
                    <IconButton onClick={() => handleOpenDialog('out', item)}>
                      <OutIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <InventoryDialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        type={dialogType}
        item={selectedItem}
      />
    </Container>
  );
};

const InventoryDialog = ({ open, onClose, type, item }) => {
  const [formData, setFormData] = useState({
    productId: item?.id || '',
    locationId: '',
    quantity: '',
    reason: '',
    reference: '',
    unitCost: '',
    fromLocationId: '',
    toLocationId: ''
  });

  const locations = ['Warehouse A', 'Warehouse B', 'Store 1', 'Store 2'];

  useEffect(() => {
    if (item) {
      setFormData({
        ...formData,
        productId: item.id || '',
        locationId: item.location || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call based on the type
    console.log(`Processing ${type}:`, formData);
    onClose();
  };

  const getDialogTitle = () => {
    switch (type) {
      case 'adjustment':
        return 'Adjust Stock';
      case 'transfer':
        return 'Transfer Stock';
      case 'out':
        return 'Stock Out';
      default:
        return 'Inventory Action';
    }
  };

  const renderDialogContent = () => {
    switch (type) {
      case 'adjustment':
        return (
          <>
            <TextField
              fullWidth
              label="Product"
              value={item?.product || ''}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Location"
              value={item?.location || ''}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              margin="normal"
              type="number"
              required
            />
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Unit Cost"
              name="unitCost"
              value={formData.unitCost}
              onChange={handleChange}
              margin="normal"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </>
        );
      case 'transfer':
        return (
          <>
            <TextField
              fullWidth
              label="Product"
              value={item?.product || ''}
              margin="normal"
              disabled
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>From Location</InputLabel>
              <Select
                name="fromLocationId"
                value={formData.fromLocationId}
                onChange={handleChange}
                label="From Location"
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>To Location</InputLabel>
              <Select
                name="toLocationId"
                value={formData.toLocationId}
                onChange={handleChange}
                label="To Location"
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              margin="normal"
              type="number"
              required
            />
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              margin="normal"
            />
          </>
        );
      case 'out':
        return (
          <>
            <TextField
              fullWidth
              label="Product"
              value={item?.product || ''}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Location"
              value={item?.location || ''}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              margin="normal"
              type="number"
              required
            />
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              margin="normal"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          {renderDialogContent()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryList;
import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

const ProductList = () => {
  const { formatCurrency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Mock data for demonstration
  const mockProducts = [
    {
      id: 1,
      name: 'Laptop',
      category: 'Electronics',
      sku: 'LAP-001',
      price: 1200,
      stock: 25,
      status: 'active',
      image: 'https://via.placeholder.com/50'
    },
    {
      id: 2,
      name: 'Desk Chair',
      category: 'Furniture',
      sku: 'CHR-002',
      price: 350,
      stock: 15,
      status: 'active',
      image: 'https://via.placeholder.com/50'
    },
    {
      id: 3,
      name: 'Monitor',
      category: 'Electronics',
      sku: 'MON-003',
      price: 450,
      stock: 8,
      status: 'low',
      image: 'https://via.placeholder.com/50'
    },
    {
      id: 4,
      name: 'Keyboard',
      category: 'Electronics',
      sku: 'KEY-004',
      price: 80,
      stock: 50,
      status: 'active',
      image: 'https://via.placeholder.com/50'
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch products from an API
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenDialog = (product = null) => {
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
  };

  const handleSaveProduct = (productData) => {
    // In a real app, you would make an API call to save the product
    console.log('Saving product:', productData);
    handleCloseDialog();
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => console.log('Import products')}
            sx={{ mr: 1 }}
          >
            Import
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search products"
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
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Avatar src={product.image} variant="rounded" />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Chip 
                    label={product.status} 
                    color={getStatusColor(product.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenDialog(product)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => console.log('Delete product', product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductDialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        product={currentProduct} 
        onSave={handleSaveProduct} 
      />
    </Container>
  );
};

const ProductDialog = ({ open, onClose, product, onSave }) => {
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    price: '',
    costPrice: '',
    stock: '',
    description: '',
    brand: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        sku: product.sku || '',
        price: product.price || '',
        costPrice: product.costPrice || '',
        stock: product.stock || '',
        description: product.description || '',
        brand: product.brand || '',
        images: []
      });
      // In a real app, you would set image previews from product.image
      setImagePreviews([]);
    } else {
      setFormData({
        name: '',
        category: '',
        sku: '',
        price: '',
        costPrice: '',
        stock: '',
        description: '',
        brand: '',
        images: []
      });
      setImagePreviews([]);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Selling Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency === 'INR' ? '₹' : '$'}</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cost Price"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                margin="normal"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency === 'INR' ? '₹' : '$'}</InputAdornment>,
                }}
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                margin="normal"
                type="number"
                required
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
            >
              Upload Images
              <input
                type="file"
                hidden
                onChange={handleImageChange}
                multiple
                accept="image/*"
              />
            </Button>
            
            {imagePreviews.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {imagePreviews.map((preview, index) => (
                  <Avatar
                    key={index}
                    src={preview}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {product ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductList;
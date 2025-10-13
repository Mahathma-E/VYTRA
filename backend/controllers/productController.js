import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import upload from '../config/multer.js';
import { validateProduct } from '../middleware/validationMiddleware.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      sku,
      barcode,
      variants,
      pricing,
      supplier,
      specifications
    } = req.body;

    // Handle file uploads
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Check if product with same SKU or barcode exists
    const existingProduct = await Product.findOne({
      $or: [{ sku }, { barcode }]
    });

    if (existingProduct) {
      return res.status(400).json({
        message: 'Product with this SKU or barcode already exists'
      });
    }

    // Create product
    const product = new Product({
      name,
      description,
      category,
      brand,
      sku,
      barcode,
      variants: variants ? JSON.parse(variants) : [],
      pricing: pricing ? JSON.parse(pricing) : {},
      supplier: supplier ? JSON.parse(supplier) : {},
      images,
      specifications: specifications ? JSON.parse(specifications) : {},
      createdBy: req.user.id
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products with filtering, pagination, and search
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Search functionality
    const keyword = req.query.search
      ? {
          $text: {
            $search: req.query.search
          }
        }
      : {};

    // Category filter
    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    // Combine filters
    const filters = {
      ...keyword,
      ...categoryFilter,
      isActive: true
    };

    const count = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID with inventory details
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'email profile.firstName profile.lastName');

    if (product) {
      // Get inventory details for this product
      const inventoryDetails = await Inventory.find({ productId: product._id })
        .populate('locationId', 'name type');

      res.json({
        product,
        inventory: inventoryDetails
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      sku,
      barcode,
      variants,
      pricing,
      supplier,
      specifications,
      isActive
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if another product with same SKU or barcode exists
      if ((sku && sku !== product.sku) || (barcode && barcode !== product.barcode)) {
        const existingProduct = await Product.findOne({
          $and: [
            { _id: { $ne: product._id } },
            { $or: [{ sku }, { barcode }] }
          ]
        });

        if (existingProduct) {
          return res.status(400).json({
            message: 'Product with this SKU or barcode already exists'
          });
        }
      }

      // Handle file uploads
      let images = product.images;
      if (req.files && req.files.length > 0) {
        images = [...images, ...req.files.map(file => `/uploads/${file.filename}`)];
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sku = sku || product.sku;
      product.barcode = barcode || product.barcode;
      product.variants = variants ? JSON.parse(variants) : product.variants;
      product.pricing = pricing ? JSON.parse(pricing) : product.pricing;
      product.supplier = supplier ? JSON.parse(supplier) : product.supplier;
      product.images = images;
      product.specifications = specifications ? JSON.parse(specifications) : product.specifications;
      product.isActive = isActive !== undefined ? isActive : product.isActive;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isActive = false;
      await product.save();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products below reorder point
export const getLowStockProducts = async (req, res) => {
  try {
    // Find inventory items below reorder point
    const lowStockItems = await Inventory.find({
      currentStock: { $lt: '$reorderPoint' }
    }).populate({
      path: 'productId',
      select: 'name sku category'
    }).populate({
      path: 'locationId',
      select: 'name'
    });

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product stock movement history
export const getProductMovements = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.id })
      .select('movements');

    if (inventory) {
      res.json(inventory.movements);
    } else {
      res.status(404).json({ message: 'Product inventory not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Import products from CSV/Excel
export const bulkImport = async (req, res) => {
  try {
    // In a real implementation, you would parse the CSV/Excel file
    // and create products from the data
    res.json({ message: 'Bulk import functionality would be implemented here' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all product categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import Location from '../models/Location.js';
import Alert from '../models/Alert.js';
import { validateInventoryAdjustment, validateObjectIdParam } from '../middleware/validationMiddleware.js';

// Get inventory with location and stock filters
export const getInventory = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filters
    const filters = {};
    
    if (req.query.locationId) {
      filters.locationId = req.query.locationId;
    }
    
    if (req.query.productId) {
      filters.productId = req.query.productId;
    }
    
    if (req.query.lowStock === 'true') {
      filters.currentStock = { $lt: '$reorderPoint' };
    }

    const count = await Inventory.countDocuments(filters);
    const inventoryItems = await Inventory.find(filters)
      .populate('productId', 'name sku category')
      .populate('locationId', 'name type')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      inventory: inventoryItems,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all locations with stock summaries
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record stock adjustments
export const recordAdjustment = async (req, res) => {
  try {
    const { productId, locationId, quantity, reason, reference, unitCost } = req.body;

    // Validate product and location
    const product = await Product.findById(productId);
    const location = await Location.findById(locationId);
    
    if (!product || !location) {
      return res.status(404).json({ message: 'Product or location not found' });
    }

    // Find or create inventory record
    let inventory = await Inventory.findOne({ productId, locationId });
    
    if (!inventory) {
      inventory = new Inventory({
        productId,
        locationId,
        currentStock: 0,
        reservedStock: 0,
        reorderPoint: 0,
        maxStock: 0
      });
    }

    // Create movement record
    const movement = {
      movementId: `ADJ-${Date.now()}`,
      type: 'adjustment',
      quantity: Math.abs(quantity),
      reason,
      reference,
      unitCost,
      totalValue: Math.abs(quantity) * (unitCost || 0),
      performedBy: req.user.id,
      timestamp: new Date()
    };

    // Update stock based on adjustment type
    if (quantity > 0) {
      inventory.currentStock += quantity;
    } else {
      inventory.currentStock += quantity; // quantity is negative
    }

    inventory.lastStockUpdate = new Date();
    inventory.movements.push(movement);

    const updatedInventory = await inventory.save();

    // Check if we need to create an alert for low stock
    if (inventory.currentStock < inventory.reorderPoint) {
      await Alert.create({
        type: 'low_stock',
        productId: inventory.productId,
        locationId: inventory.locationId,
        title: `Low Stock Alert: ${product.name}`,
        message: `Current stock (${inventory.currentStock}) is below reorder point (${inventory.reorderPoint})`,
        severity: 'high',
        actionRequired: true,
        recommendedAction: 'Reorder product',
        affectedUsers: [] // In a real app, you would populate this with relevant users
      });
    }

    res.status(201).json({
      message: 'Stock adjustment recorded',
      inventory: updatedInventory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Transfer stock between locations
export const transferStock = async (req, res) => {
  try {
    const { productId, fromLocationId, toLocationId, quantity, reason, reference } = req.body;

    // Validate product and locations
    const product = await Product.findById(productId);
    const fromLocation = await Location.findById(fromLocationId);
    const toLocation = await Location.findById(toLocationId);
    
    if (!product || !fromLocation || !toLocation) {
      return res.status(404).json({ message: 'Product or location not found' });
    }

    // Find inventory records
    let fromInventory = await Inventory.findOne({ productId, locationId: fromLocationId });
    let toInventory = await Inventory.findOne({ productId, locationId: toLocationId });
    
    if (!fromInventory || fromInventory.currentStock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock at source location' });
    }
    
    if (!toInventory) {
      toInventory = new Inventory({
        productId,
        locationId: toLocationId,
        currentStock: 0,
        reservedStock: 0,
        reorderPoint: 0,
        maxStock: 0
      });
    }

    // Create movement records
    const transferId = `TRF-${Date.now()}`;
    
    const outMovement = {
      movementId: `${transferId}-OUT`,
      type: 'out',
      quantity,
      reason: reason || 'Stock transfer',
      reference,
      fromLocation: fromLocationId,
      toLocation: toLocationId,
      performedBy: req.user.id,
      timestamp: new Date()
    };
    
    const inMovement = {
      movementId: `${transferId}-IN`,
      type: 'in',
      quantity,
      reason: reason || 'Stock transfer',
      reference,
      fromLocation: fromLocationId,
      toLocation: toLocationId,
      performedBy: req.user.id,
      timestamp: new Date()
    };

    // Update stock levels
    fromInventory.currentStock -= quantity;
    fromInventory.lastStockUpdate = new Date();
    fromInventory.movements.push(outMovement);
    
    toInventory.currentStock += quantity;
    toInventory.lastStockUpdate = new Date();
    toInventory.movements.push(inMovement);

    // Save both inventory records
    await fromInventory.save();
    await toInventory.save();

    res.status(200).json({
      message: 'Stock transfer completed',
      fromInventory,
      toInventory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory movement history
export const getMovements = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filters
    const filters = {};
    
    if (req.query.productId) {
      filters.productId = req.query.productId;
    }
    
    if (req.query.locationId) {
      filters.locationId = req.query.locationId;
    }

    const count = await Inventory.countDocuments(filters);
    
    // Get inventory items with populated movements
    const inventoryItems = await Inventory.find(filters)
      .populate('productId', 'name sku')
      .populate('locationId', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Extract all movements
    const allMovements = [];
    inventoryItems.forEach(item => {
      item.movements.forEach(movement => {
        allMovements.push({
          ...movement._doc,
          product: item.productId,
          location: item.locationId
        });
      });
    });

    // Sort by timestamp (newest first)
    allMovements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      movements: allMovements,
      page,
      pages: Math.ceil(count / pageSize),
      total: allMovements.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory valuation reports
export const getValuation = async (req, res) => {
  try {
    // Get all inventory items with product pricing info
    const inventoryItems = await Inventory.find()
      .populate('productId', 'name sku pricing')
      .populate('locationId', 'name');

    let totalValue = 0;
    const valuationByLocation = {};
    const valuationByProduct = {};

    inventoryItems.forEach(item => {
      const productValue = item.currentStock * (item.productId.pricing?.costPrice || 0);
      totalValue += productValue;

      // By location
      if (!valuationByLocation[item.locationId.name]) {
        valuationByLocation[item.locationId.name] = 0;
      }
      valuationByLocation[item.locationId.name] += productValue;

      // By product
      if (!valuationByProduct[item.productId.name]) {
        valuationByProduct[item.productId.name] = 0;
      }
      valuationByProduct[item.productId.name] += productValue;
    });

    res.json({
      totalValue,
      valuationByLocation,
      valuationByProduct,
      items: inventoryItems.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate reorder recommendations
export const generateReorderRecommendations = async (req, res) => {
  try {
    // Find inventory items below reorder point
    const lowStockItems = await Inventory.find({
      currentStock: { $lt: '$reorderPoint' }
    }).populate({
      path: 'productId',
      select: 'name sku supplier'
    }).populate({
      path: 'locationId',
      select: 'name'
    });

    const recommendations = lowStockItems.map(item => ({
      productId: item.productId._id,
      productName: item.productId.name,
      sku: item.productId.sku,
      currentStock: item.currentStock,
      reorderPoint: item.reorderPoint,
      location: item.locationId.name,
      supplier: item.productId.supplier?.supplierName || 'Unknown',
      recommendedOrderQuantity: Math.max(
        item.reorderPoint - item.currentStock + (item.productId.supplier?.minimumOrderQuantity || 0),
        item.productId.supplier?.minimumOrderQuantity || 0
      )
    }));

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate inventory turnover metrics
export const getTurnoverMetrics = async (req, res) => {
  try {
    // In a real implementation, you would calculate turnover based on sales data
    // For now, we'll return mock data
    res.json({
      message: 'Inventory turnover metrics would be calculated here based on sales data'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
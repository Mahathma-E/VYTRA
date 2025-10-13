import Product from '../models/Product.js';
import Sales from '../models/Sales.js';
import Inventory from '../models/Inventory.js';
import mongoose from 'mongoose';

// Get dashboard KPIs and metrics
export const getDashboardMetrics = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Product.countDocuments({ isActive: true });
    
    // Get total inventory value
    const inventoryItems = await Inventory.find().populate('productId', 'pricing');
    let totalInventoryValue = 0;
    inventoryItems.forEach(item => {
      totalInventoryValue += item.currentStock * (item.productId.pricing?.costPrice || 0);
    });
    
    // Get low stock items
    const lowStockItems = await Inventory.countDocuments({
      currentStock: { $lt: '$reorderPoint' }
    });
    
    // Get recent sales (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSales = await Sales.find({
      saleDate: { $gte: thirtyDaysAgo }
    });
    
    let totalSalesValue = 0;
    let totalSalesQuantity = 0;
    recentSales.forEach(sale => {
      totalSalesValue += sale.totalAmount;
      totalSalesQuantity += sale.quantitySold;
    });

    res.json({
      totalProducts,
      totalInventoryValue,
      lowStockItems,
      recentSales: {
        count: recentSales.length,
        totalValue: totalSalesValue,
        totalQuantity: totalSalesQuantity
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get demand forecast for specific product
export const getProductForecast = async (req, res) => {
  try {
    const { productId } = req.params;
    const { days = 30 } = req.query;
    
    // Get historical sales data for the product
    const salesHistory = await Sales.find({
      productId,
      saleDate: {
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    }).sort({ saleDate: 1 });
    
    if (salesHistory.length === 0) {
      return res.status(404).json({ message: 'No sales data found for this product' });
    }
    
    // Simple moving average forecast
    const totalQuantity = salesHistory.reduce((sum, sale) => sum + sale.quantitySold, 0);
    const averageDailySales = totalQuantity / salesHistory.length;
    
    // Forecast for next 7 days
    const forecast = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      forecast.push({
        date: forecastDate,
        predictedQuantity: Math.round(averageDailySales),
        confidence: 0.85 // Simple confidence level
      });
    }
    
    res.json({
      productId,
      forecastPeriod: '7 days',
      averageDailySales,
      forecast
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales and inventory trends
export const getTrends = async (req, res) => {
  try {
    // Get sales trends (monthly for last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const salesTrends = await Sales.aggregate([
      {
        $match: {
          saleDate: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$saleDate' },
            month: { $month: '$saleDate' }
          },
          totalSales: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantitySold' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    // Get inventory trends (current stock levels by category)
    const inventoryTrends = await Product.aggregate([
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: 'productId',
          as: 'inventory'
        }
      },
      {
        $unwind: '$inventory'
      },
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$inventory.currentStock' },
          averageStock: { $avg: '$inventory.currentStock' }
        }
      },
      {
        $sort: {
          totalStock: -1
        }
      }
    ]);
    
    res.json({
      salesTrends,
      inventoryTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Perform ABC analysis on products
export const getABCAnalysis = async (req, res) => {
  try {
    // Get products with sales data
    const productsWithSales = await Product.aggregate([
      {
        $lookup: {
          from: 'sales',
          localField: '_id',
          foreignField: 'productId',
          as: 'sales'
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          sku: 1,
          totalSalesValue: {
            $sum: '$sales.totalAmount'
          },
          totalSalesQuantity: {
            $sum: '$sales.quantitySold'
          }
        }
      },
      {
        $sort: {
          totalSalesValue: -1
        }
      }
    ]);
    
    // Calculate total sales value
    const totalSalesValue = productsWithSales.reduce((sum, product) => sum + (product.totalSalesValue || 0), 0);
    
    // Classify products into A, B, C categories
    let cumulativeValue = 0;
    const abcAnalysis = productsWithSales.map(product => {
      cumulativeValue += product.totalSalesValue || 0;
      const cumulativePercentage = (cumulativeValue / totalSalesValue) * 100;
      
      let category = 'C'; // Default to C
      if (cumulativePercentage <= 80) {
        category = 'A';
      } else if (cumulativePercentage <= 95) {
        category = 'B';
      }
      
      return {
        ...product,
        cumulativePercentage,
        category
      };
    });
    
    res.json(abcAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analyze seasonal demand patterns
export const getSeasonalPatterns = async (req, res) => {
  try {
    // Get sales grouped by month and day of week
    const seasonalData = await Sales.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$saleDate' },
            dayOfWeek: { $dayOfWeek: '$saleDate' }
          },
          totalSales: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantitySold' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.month': 1,
          '_id.dayOfWeek': 1
        }
      }
    ]);
    
    // Group by month
    const monthlyPatterns = {};
    const dayOfWeekPatterns = {};
    
    seasonalData.forEach(item => {
      const month = item._id.month;
      const dayOfWeek = item._id.dayOfWeek;
      
      if (!monthlyPatterns[month]) {
        monthlyPatterns[month] = {
          totalSales: 0,
          totalQuantity: 0,
          count: 0
        };
      }
      
      if (!dayOfWeekPatterns[dayOfWeek]) {
        dayOfWeekPatterns[dayOfWeek] = {
          totalSales: 0,
          totalQuantity: 0,
          count: 0
        };
      }
      
      monthlyPatterns[month].totalSales += item.totalSales;
      monthlyPatterns[month].totalQuantity += item.totalQuantity;
      monthlyPatterns[month].count += item.count;
      
      dayOfWeekPatterns[dayOfWeek].totalSales += item.totalSales;
      dayOfWeekPatterns[dayOfWeek].totalQuantity += item.totalQuantity;
      dayOfWeekPatterns[dayOfWeek].count += item.count;
    });
    
    res.json({
      monthlyPatterns,
      dayOfWeekPatterns
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate custom reports
export const generateCustomReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.body;
    
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let reportData;
    
    switch (reportType) {
      case 'sales':
        reportData = await Sales.find({
          saleDate: { $gte: start, $lte: end }
        }).populate('productId', 'name sku');
        break;
      case 'inventory':
        reportData = await Inventory.find({
          lastStockUpdate: { $gte: start, $lte: end }
        }).populate('productId', 'name sku').populate('locationId', 'name');
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    res.json({
      reportType,
      startDate: start,
      endDate: end,
      data: reportData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get supplier performance metrics
export const getSupplierPerformance = async (req, res) => {
  try {
    // In a real implementation, you would analyze supplier data
    // For now, we'll return mock data
    res.json({
      message: 'Supplier performance metrics would be calculated here'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stock level optimization suggestions
export const getStockOptimization = async (req, res) => {
  try {
    // Find inventory items with optimization opportunities
    const inventoryItems = await Inventory.find()
      .populate('productId', 'name sku category supplier')
      .populate('locationId', 'name');
    
    const optimizationSuggestions = inventoryItems.map(item => {
      // Simple optimization logic - in a real app, you would use more sophisticated algorithms
      const suggestedReorderPoint = Math.max(
        item.currentStock * 0.2, // 20% of current stock
        item.productId.supplier?.minimumOrderQuantity || 0
      );
      
      const suggestedMaxStock = item.reorderPoint * 3; // 3x reorder point
      
      return {
        productId: item.productId._id,
        productName: item.productId.name,
        sku: item.productId.sku,
        currentStock: item.currentStock,
        currentReorderPoint: item.reorderPoint,
        currentMaxStock: item.maxStock,
        suggestedReorderPoint,
        suggestedMaxStock,
        location: item.locationId.name,
        category: item.productId.category,
        supplier: item.productId.supplier?.supplierName || 'Unknown'
      };
    });
    
    res.json(optimizationSuggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
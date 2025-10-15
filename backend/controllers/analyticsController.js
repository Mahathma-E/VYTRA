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
    const Supplier = (await import('../models/Supplier.js')).default;
    
    // Get supplier performance data
    const suppliers = await Supplier.find({ status: 'active' });
    
    const supplierPerformance = await Promise.all(suppliers.map(async (supplier) => {
      // Get products from this supplier
      const supplierProducts = await Product.find({ supplier: supplier.name });
      
      // Get sales data for these products
      const salesData = await Sales.find({
        product: { $in: supplierProducts.map(p => p._id) }
      });
      
      const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
      const totalQuantity = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
      
      return {
        supplierId: supplier._id,
        supplierName: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        totalProducts: supplierProducts.length,
        totalSales: totalSales,
        totalQuantity: totalQuantity,
        averageOrderValue: salesData.length > 0 ? totalSales / salesData.length : 0,
        lastOrderDate: salesData.length > 0 ? Math.max(...salesData.map(s => new Date(s.date))) : null,
        performance: totalSales > 10000 ? 'Excellent' : totalSales > 5000 ? 'Good' : 'Average'
      };
    }));
    
    res.json(supplierPerformance);
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

// Data analysis for imported Excel data
export const analyzeImportedData = async (req, res) => {
  try {
    const { dataType, startDate, endDate } = req.query;
    
    let analysis = {};
    
    switch (dataType) {
      case 'products':
        analysis = await analyzeProductData(startDate, endDate);
        break;
      case 'sales':
        analysis = await analyzeSalesData(startDate, endDate);
        break;
      case 'inventory':
        analysis = await analyzeInventoryData();
        break;
      case 'suppliers':
        analysis = await analyzeSupplierData();
        break;
      default:
        analysis = await analyzeAllData(startDate, endDate);
    }
    
    res.json({
      success: true,
      dataType: dataType || 'all',
      analysis: analysis,
      generatedAt: new Date()
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error analyzing data', 
      error: error.message 
    });
  }
};

// Analyze product data
const analyzeProductData = async (startDate, endDate) => {
  const products = await Product.find();
  
  const categoryAnalysis = {};
  const brandAnalysis = {};
  const priceAnalysis = {
    min: Infinity,
    max: 0,
    average: 0,
    median: 0
  };
  
  let totalValue = 0;
  const prices = [];
  
  products.forEach(product => {
    // Category analysis
    const category = product.category || 'Uncategorized';
    categoryAnalysis[category] = (categoryAnalysis[category] || 0) + 1;
    
    // Brand analysis
    const brand = product.brand || 'Unknown';
    brandAnalysis[brand] = (brandAnalysis[brand] || 0) + 1;
    
    // Price analysis
    const price = product.price || 0;
    prices.push(price);
    totalValue += price;
    priceAnalysis.min = Math.min(priceAnalysis.min, price);
    priceAnalysis.max = Math.max(priceAnalysis.max, price);
  });
  
  // Calculate price statistics
  prices.sort((a, b) => a - b);
  priceAnalysis.average = totalValue / products.length;
  priceAnalysis.median = prices.length % 2 === 0 
    ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
    : prices[Math.floor(prices.length / 2)];
  
  return {
    totalProducts: products.length,
    categoryDistribution: categoryAnalysis,
    brandDistribution: brandAnalysis,
    priceAnalysis: priceAnalysis,
    topCategories: Object.entries(categoryAnalysis)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5),
    topBrands: Object.entries(brandAnalysis)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  };
};

// Analyze sales data
const analyzeSalesData = async (startDate, endDate) => {
  const filter = {};
  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  
  const sales = await Sales.find(filter).populate('product', 'name category');
  
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  
  // Daily sales analysis
  const dailySales = {};
  const categorySales = {};
  const productSales = {};
  
  sales.forEach(sale => {
    const date = sale.date.toISOString().split('T')[0];
    dailySales[date] = (dailySales[date] || 0) + sale.total;
    
    const category = sale.product?.category || 'Unknown';
    categorySales[category] = (categorySales[category] || 0) + sale.total;
    
    const productName = sale.product?.name || 'Unknown';
    productSales[productName] = (productSales[productName] || 0) + sale.total;
  });
  
  return {
    totalSales: sales.length,
    totalRevenue: totalRevenue,
    totalQuantity: totalQuantity,
    averageOrderValue: sales.length > 0 ? totalRevenue / sales.length : 0,
    dailySales: dailySales,
    categoryPerformance: Object.entries(categorySales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10),
    topProducts: Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10),
    salesTrend: calculateSalesTrend(dailySales)
  };
};

// Analyze inventory data
const analyzeInventoryData = async () => {
  const inventory = await Inventory.find().populate('product', 'name category price');
  
  const totalValue = inventory.reduce((sum, item) => {
    return sum + (item.quantity * (item.product?.price || 0));
  }, 0);
  
  const lowStockItems = inventory.filter(item => item.quantity < (item.product?.minStock || 0));
  const outOfStockItems = inventory.filter(item => item.quantity === 0);
  
  const categoryInventory = {};
  inventory.forEach(item => {
    const category = item.product?.category || 'Unknown';
    if (!categoryInventory[category]) {
      categoryInventory[category] = { quantity: 0, value: 0 };
    }
    categoryInventory[category].quantity += item.quantity;
    categoryInventory[category].value += item.quantity * (item.product?.price || 0);
  });
  
  return {
    totalItems: inventory.length,
    totalValue: totalValue,
    lowStockCount: lowStockItems.length,
    outOfStockCount: outOfStockItems.length,
    categoryBreakdown: categoryInventory,
    lowStockItems: lowStockItems.map(item => ({
      productName: item.product?.name,
      currentStock: item.quantity,
      minStock: item.product?.minStock || 0,
      location: item.location
    }))
  };
};

// Analyze supplier data
const analyzeSupplierData = async () => {
  const Supplier = (await import('../models/Supplier.js')).default;
  const suppliers = await Supplier.find();
  
  const locationAnalysis = {};
  const statusAnalysis = {};
  
  suppliers.forEach(supplier => {
    const location = supplier.country || 'Unknown';
    locationAnalysis[location] = (locationAnalysis[location] || 0) + 1;
    
    const status = supplier.status || 'Unknown';
    statusAnalysis[status] = (statusAnalysis[status] || 0) + 1;
  });
  
  return {
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter(s => s.status === 'active').length,
    locationDistribution: locationAnalysis,
    statusDistribution: statusAnalysis,
    topLocations: Object.entries(locationAnalysis)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  };
};

// Analyze all data
const analyzeAllData = async (startDate, endDate) => {
  const [productAnalysis, salesAnalysis, inventoryAnalysis, supplierAnalysis] = await Promise.all([
    analyzeProductData(startDate, endDate),
    analyzeSalesData(startDate, endDate),
    analyzeInventoryData(),
    analyzeSupplierData()
  ]);
  
  return {
    overview: {
      totalProducts: productAnalysis.totalProducts,
      totalSales: salesAnalysis.totalSales,
      totalRevenue: salesAnalysis.totalRevenue,
      totalInventoryValue: inventoryAnalysis.totalValue,
      totalSuppliers: supplierAnalysis.totalSuppliers
    },
    products: productAnalysis,
    sales: salesAnalysis,
    inventory: inventoryAnalysis,
    suppliers: supplierAnalysis
  };
};

// Calculate sales trend
const calculateSalesTrend = (dailySales) => {
  const dates = Object.keys(dailySales).sort();
  if (dates.length < 2) return 'insufficient_data';
  
  const firstWeek = dates.slice(0, 7).reduce((sum, date) => sum + dailySales[date], 0);
  const lastWeek = dates.slice(-7).reduce((sum, date) => sum + dailySales[date], 0);
  
  const change = ((lastWeek - firstWeek) / firstWeek) * 100;
  
  if (change > 10) return 'increasing';
  if (change < -10) return 'decreasing';
  return 'stable';
};

// Generate comprehensive report
export const generateComprehensiveReport = async (req, res) => {
  try {
    const { startDate, endDate, includeCharts = true } = req.body;
    
    const analysis = await analyzeAllData(startDate, endDate);
    
    const report = {
      reportId: `RPT-${Date.now()}`,
      generatedAt: new Date(),
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present'
      },
      executiveSummary: {
        totalProducts: analysis.overview.totalProducts,
        totalRevenue: analysis.overview.totalRevenue,
        inventoryValue: analysis.overview.totalInventoryValue,
        activeSuppliers: analysis.suppliers.activeSuppliers,
        keyInsights: generateKeyInsights(analysis)
      },
      detailedAnalysis: analysis,
      recommendations: generateRecommendations(analysis),
      charts: includeCharts ? generateChartData(analysis) : null
    };
    
    res.json({
      success: true,
      report: report
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error generating report', 
      error: error.message 
    });
  }
};

// Generate key insights
const generateKeyInsights = (analysis) => {
  const insights = [];
  
  // Sales insights
  if (analysis.sales.salesTrend === 'increasing') {
    insights.push('Sales are showing an upward trend - consider increasing inventory for top products');
  } else if (analysis.sales.salesTrend === 'decreasing') {
    insights.push('Sales are declining - review pricing and marketing strategies');
  }
  
  // Inventory insights
  if (analysis.inventory.lowStockCount > 0) {
    insights.push(`${analysis.inventory.lowStockCount} products are running low on stock`);
  }
  
  if (analysis.inventory.outOfStockCount > 0) {
    insights.push(`${analysis.inventory.outOfStockCount} products are out of stock`);
  }
  
  // Product insights
  const topCategory = analysis.products.topCategories[0];
  if (topCategory) {
    insights.push(`${topCategory[0]} is your top-performing category with ${topCategory[1]} products`);
  }
  
  return insights;
};

// Generate recommendations
const generateRecommendations = (analysis) => {
  const recommendations = [];
  
  // Inventory recommendations
  if (analysis.inventory.lowStockCount > 5) {
    recommendations.push('Consider implementing automated reorder alerts for low-stock items');
  }
  
  // Sales recommendations
  const topProducts = analysis.sales.topProducts.slice(0, 3);
  if (topProducts.length > 0) {
    recommendations.push(`Focus marketing efforts on top 3 products: ${topProducts.map(p => p[0]).join(', ')}`);
  }
  
  // Supplier recommendations
  if (analysis.suppliers.activeSuppliers < 3) {
    recommendations.push('Consider diversifying your supplier base to reduce risk');
  }
  
  return recommendations;
};

// Generate chart data
const generateChartData = (analysis) => {
  return {
    categoryDistribution: {
      labels: analysis.products.topCategories.map(c => c[0]),
      data: analysis.products.topCategories.map(c => c[1])
    },
    salesTrend: {
      labels: Object.keys(analysis.sales.dailySales),
      data: Object.values(analysis.sales.dailySales)
    },
    inventoryValue: {
      labels: Object.keys(analysis.inventory.categoryBreakdown),
      data: Object.values(analysis.inventory.categoryBreakdown).map(c => c.value)
    }
  };
};
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Sales from '../models/Sales.js';
import Supplier from '../models/Supplier.js';

// Import Excel/CSV file and process data
export const importExcelData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let data = [];
    let analysis = {
      totalRows: 0,
      processedRows: 0,
      errors: [],
      warnings: [],
      summary: {}
    };

    // Read file based on extension
    if (fileExtension === '.csv') {
      data = await readCSVFile(filePath);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      data = await readExcelFile(filePath);
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Unsupported file format' 
      });
    }

    analysis.totalRows = data.length;

    // Process the data based on the data type
    const dataType = req.body.dataType || 'auto'; // products, inventory, sales, suppliers, auto
    
    if (dataType === 'auto') {
      // Auto-detect data type based on column names
      const detectedType = detectDataType(data[0]);
      analysis.summary.detectedType = detectedType;
      await processDataByType(data, detectedType, analysis);
    } else {
      await processDataByType(data, dataType, analysis);
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Data imported successfully',
      analysis: analysis
    });

  } catch (error) {
    console.error('Excel import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error importing data', 
      error: error.message 
    });
  }
};

// Read CSV file
const readCSVFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const csv = require('csv-parser');
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

// Read Excel file
const readExcelFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

// Auto-detect data type based on column names
const detectDataType = (firstRow) => {
  const columns = Object.keys(firstRow).map(key => key.toLowerCase());
  
  if (columns.some(col => col.includes('product') || col.includes('name') || col.includes('sku'))) {
    return 'products';
  } else if (columns.some(col => col.includes('quantity') || col.includes('stock') || col.includes('inventory'))) {
    return 'inventory';
  } else if (columns.some(col => col.includes('sale') || col.includes('revenue') || col.includes('price'))) {
    return 'sales';
  } else if (columns.some(col => col.includes('supplier') || col.includes('vendor'))) {
    return 'suppliers';
  }
  
  return 'products'; // Default to products
};

// Process data based on type
const processDataByType = async (data, dataType, analysis) => {
  switch (dataType) {
    case 'products':
      await processProducts(data, analysis);
      break;
    case 'inventory':
      await processInventory(data, analysis);
      break;
    case 'sales':
      await processSales(data, analysis);
      break;
    case 'suppliers':
      await processSuppliers(data, analysis);
      break;
    default:
      throw new Error(`Unknown data type: ${dataType}`);
  }
};

// Process product data
const processProducts = async (data, analysis) => {
  const processedProducts = [];
  
  for (let i = 0; i < data.length; i++) {
    try {
      const row = data[i];
      const productData = {
        name: row.name || row.product_name || row.product || row.title || '',
        sku: row.sku || row.product_sku || row.code || '',
        description: row.description || row.desc || '',
        category: row.category || row.type || 'General',
        price: parseFloat(row.price || row.cost || row.unit_price || 0),
        cost: parseFloat(row.cost || row.unit_cost || row.purchase_price || 0),
        brand: row.brand || row.manufacturer || '',
        unit: row.unit || row.measurement || 'piece',
        minStock: parseInt(row.min_stock || row.minimum_stock || row.reorder_level || 0),
        maxStock: parseInt(row.max_stock || row.maximum_stock || 1000),
        supplier: row.supplier || row.vendor || '',
        barcode: row.barcode || row.upc || '',
        status: row.status || 'active'
      };

      // Validate required fields
      if (!productData.name) {
        analysis.warnings.push(`Row ${i + 1}: Missing product name`);
        continue;
      }

      // Check if product already exists
      const existingProduct = await Product.findOne({ 
        $or: [
          { sku: productData.sku },
          { name: productData.name }
        ]
      });

      if (existingProduct) {
        // Update existing product
        Object.assign(existingProduct, productData);
        await existingProduct.save();
        analysis.warnings.push(`Row ${i + 1}: Updated existing product "${productData.name}"`);
      } else {
        // Create new product
        const newProduct = new Product(productData);
        await newProduct.save();
        processedProducts.push(newProduct);
      }

      analysis.processedRows++;
    } catch (error) {
      analysis.errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }

  analysis.summary.productsCreated = processedProducts.length;
  analysis.summary.productsUpdated = analysis.warnings.filter(w => w.includes('Updated')).length;
};

// Process inventory data
const processInventory = async (data, analysis) => {
  for (let i = 0; i < data.length; i++) {
    try {
      const row = data[i];
      
      // Find product by SKU or name
      const product = await Product.findOne({
        $or: [
          { sku: row.sku || row.product_sku },
          { name: row.name || row.product_name }
        ]
      });

      if (!product) {
        analysis.errors.push(`Row ${i + 1}: Product not found for SKU/Name: ${row.sku || row.name}`);
        continue;
      }

      const inventoryData = {
        product: product._id,
        quantity: parseInt(row.quantity || row.stock || row.qty || 0),
        location: row.location || row.warehouse || 'Main Warehouse',
        lastUpdated: new Date(),
        notes: row.notes || row.comments || ''
      };

      // Update or create inventory record
      await Inventory.findOneAndUpdate(
        { product: product._id, location: inventoryData.location },
        inventoryData,
        { upsert: true, new: true }
      );

      analysis.processedRows++;
    } catch (error) {
      analysis.errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }
};

// Process sales data
const processSales = async (data, analysis) => {
  for (let i = 0; i < data.length; i++) {
    try {
      const row = data[i];
      
      // Find product
      const product = await Product.findOne({
        $or: [
          { sku: row.sku || row.product_sku },
          { name: row.name || row.product_name }
        ]
      });

      if (!product) {
        analysis.errors.push(`Row ${i + 1}: Product not found for SKU/Name: ${row.sku || row.name}`);
        continue;
      }

      const salesData = {
        product: product._id,
        quantity: parseInt(row.quantity || row.qty || 1),
        price: parseFloat(row.price || row.unit_price || product.price),
        total: parseFloat(row.total || row.revenue || (row.quantity * row.price)),
        date: new Date(row.date || row.sale_date || Date.now()),
        customer: row.customer || row.buyer || 'Unknown',
        location: row.location || 'Online',
        notes: row.notes || ''
      };

      const sale = new Sales(salesData);
      await sale.save();

      analysis.processedRows++;
    } catch (error) {
      analysis.errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }
};

// Process supplier data
const processSuppliers = async (data, analysis) => {
  for (let i = 0; i < data.length; i++) {
    try {
      const row = data[i];
      
      const supplierData = {
        name: row.name || row.supplier_name || row.vendor || '',
        contactPerson: row.contact_person || row.contact || '',
        email: row.email || '',
        phone: row.phone || row.telephone || '',
        address: row.address || '',
        city: row.city || '',
        state: row.state || '',
        zipCode: row.zip_code || row.postal_code || '',
        country: row.country || '',
        paymentTerms: row.payment_terms || 'Net 30',
        status: row.status || 'active',
        notes: row.notes || ''
      };

      if (!supplierData.name) {
        analysis.warnings.push(`Row ${i + 1}: Missing supplier name`);
        continue;
      }

      // Check if supplier already exists
      const existingSupplier = await Supplier.findOne({ name: supplierData.name });
      
      if (existingSupplier) {
        Object.assign(existingSupplier, supplierData);
        await existingSupplier.save();
        analysis.warnings.push(`Row ${i + 1}: Updated existing supplier "${supplierData.name}"`);
      } else {
        const supplier = new Supplier(supplierData);
        await supplier.save();
      }

      analysis.processedRows++;
    } catch (error) {
      analysis.errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }
};

// Get import template
export const getImportTemplate = async (req, res) => {
  try {
    const dataType = req.query.type || 'products';
    
    let template = {};
    
    switch (dataType) {
      case 'products':
        template = {
          name: 'Product Name (Required)',
          sku: 'SKU/Product Code',
          description: 'Product Description',
          category: 'Category',
          price: 'Selling Price',
          cost: 'Cost Price',
          brand: 'Brand',
          unit: 'Unit (piece, kg, liter, etc.)',
          minStock: 'Minimum Stock Level',
          maxStock: 'Maximum Stock Level',
          supplier: 'Supplier Name',
          barcode: 'Barcode/UPC',
          status: 'Status (active/inactive)'
        };
        break;
      case 'inventory':
        template = {
          sku: 'Product SKU (Required)',
          name: 'Product Name (Alternative to SKU)',
          quantity: 'Current Stock Quantity',
          location: 'Warehouse/Location',
          notes: 'Notes/Comments'
        };
        break;
      case 'sales':
        template = {
          sku: 'Product SKU (Required)',
          name: 'Product Name (Alternative to SKU)',
          quantity: 'Quantity Sold',
          price: 'Unit Price',
          total: 'Total Amount',
          date: 'Sale Date (YYYY-MM-DD)',
          customer: 'Customer Name',
          location: 'Sale Location',
          notes: 'Notes'
        };
        break;
      case 'suppliers':
        template = {
          name: 'Supplier Name (Required)',
          contactPerson: 'Contact Person',
          email: 'Email Address',
          phone: 'Phone Number',
          address: 'Address',
          city: 'City',
          state: 'State/Province',
          zipCode: 'ZIP/Postal Code',
          country: 'Country',
          paymentTerms: 'Payment Terms',
          status: 'Status (active/inactive)',
          notes: 'Notes'
        };
        break;
    }

    res.status(200).json({
      success: true,
      dataType: dataType,
      template: template,
      instructions: getTemplateInstructions(dataType)
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error generating template', 
      error: error.message 
    });
  }
};

const getTemplateInstructions = (dataType) => {
  const instructions = {
    products: [
      'Required fields: name',
      'SKU should be unique for each product',
      'Price and cost should be numeric values',
      'Category helps organize products',
      'Min/max stock levels are used for alerts'
    ],
    inventory: [
      'Required: Either SKU or product name',
      'Quantity should be a positive number',
      'Location helps track stock across warehouses',
      'Updates existing inventory or creates new records'
    ],
    sales: [
      'Required: Either SKU or product name',
      'Date format: YYYY-MM-DD or leave empty for current date',
      'Total is calculated automatically if not provided',
      'Creates new sales records'
    ],
    suppliers: [
      'Required field: name',
      'Contact information helps with procurement',
      'Payment terms affect ordering process',
      'Updates existing suppliers or creates new ones'
    ]
  };
  
  return instructions[dataType] || [];
};

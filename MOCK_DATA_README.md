# Mock Data Files for Inventory Management System

This package includes mock Excel data files that you can import and analyze in the Inventory Management System.

## Files Included

1. **mock_products.xlsx** - Product catalog data
2. **mock_inventory.xlsx** - Current inventory levels
3. **mock_suppliers.xlsx** - Supplier information
4. **mock_sales.xlsx** - Historical sales data
5. **mock_combined.xlsx** - All data types in one file

## How to Import Data

1. Open the Inventory Management System application
2. Navigate to the "Excel Import" section
3. Click "Choose File" and select one of the mock data files
4. Select the appropriate data type:
   - For mock_products.xlsx: Select "Products"
   - For mock_inventory.xlsx: Select "Inventory"
   - For mock_suppliers.xlsx: Select "Suppliers"
   - For mock_sales.xlsx: Select "Sales"
   - For mock_combined.xlsx: Select "Auto-detect" or the specific type
5. Click "Import Data"

## Data Structure

### Products
- name (Required): Product name
- sku: Unique product identifier
- description: Product description
- category: Product category
- price: Selling price
- cost: Cost price
- brand: Manufacturer/brand
- unit: Unit of measurement
- minStock: Minimum stock level
- maxStock: Maximum stock level
- supplier: Supplier name
- barcode: Product barcode
- status: Product status (active/inactive)

### Inventory
- sku: Product SKU (required if no name)
- name: Product name (required if no SKU)
- quantity: Current stock quantity
- location: Warehouse/location
- notes: Additional notes

### Suppliers
- name (Required): Supplier name
- contactPerson: Contact person
- email: Email address
- phone: Phone number
- address: Street address
- city: City
- state: State/province
- zipCode: ZIP/Postal code
- country: Country
- paymentTerms: Payment terms
- status: Supplier status (active/inactive)
- notes: Additional notes

### Sales
- sku: Product SKU (required if no name)
- name: Product name (required if no SKU)
- quantity: Quantity sold
- price: Unit price
- total: Total amount
- date: Sale date (YYYY-MM-DD)
- customer: Customer name
- location: Sale location
- notes: Additional notes

## Analyzing Data

After importing the data, you can use the analytics features of the application to:
- View inventory levels and trends
- Analyze sales performance
- Monitor supplier relationships
- Generate reports on product performance
- Identify low stock items
- Track revenue and profit margins

## Notes

- All data is mock/fake and for testing purposes only
- The system will automatically detect data types when using "Auto-detect" option
- Existing records with matching SKUs or names will be updated
- Import errors will be displayed in the analysis report
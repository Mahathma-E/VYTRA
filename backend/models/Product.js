import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  barcode: {
    type: String,
    unique: true,
    trim: true
  },
  variants: [{
    variantId: String,
    size: String,
    color: String,
    weight: String,
    additionalPrice: Number
  }],
  pricing: {
    costPrice: {
      type: Number,
      required: true
    },
    sellingPrice: {
      type: Number,
      required: true
    },
    margin: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  supplier: {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    },
    supplierName: String,
    leadTime: Number,
    minimumOrderQuantity: Number
  },
  images: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'pricing.costPrice': 1 });
productSchema.index({ 'pricing.sellingPrice': 1 });

// Compound indexes
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ createdBy: 1, createdAt: -1 });

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  currentStock: {
    type: Number,
    default: 0
  },
  reservedStock: {
    type: Number,
    default: 0
  },
  availableStock: {
    type: Number,
    default: 0
  },
  reorderPoint: {
    type: Number,
    default: 0
  },
  maxStock: {
    type: Number,
    default: 0
  },
  averageLeadTime: {
    type: Number,
    default: 0
  },
  lastStockUpdate: {
    type: Date,
    default: Date.now
  },
  movements: [{
    movementId: String,
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment', 'transfer'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: String,
    reference: String,
    fromLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    toLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    unitCost: Number,
    totalValue: Number,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Calculate available stock before saving
inventorySchema.pre('save', function(next) {
  this.availableStock = this.currentStock - this.reservedStock;
  next();
});

// Indexes
inventorySchema.index({ productId: 1 });
inventorySchema.index({ locationId: 1 });
inventorySchema.index({ currentStock: 1 });
inventorySchema.index({ reorderPoint: 1 });
inventorySchema.index({ lastStockUpdate: -1 });

// Compound indexes
inventorySchema.index({ productId: 1, locationId: 1 }, { unique: true });
inventorySchema.index({ currentStock: 1, reorderPoint: 1 });
inventorySchema.index({ locationId: 1, lastStockUpdate: -1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
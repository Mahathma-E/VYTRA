import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['low_stock', 'overstock', 'expiry', 'demand_spike', 'supplier_delay'],
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  recommendedAction: {
    type: String
  },
  affectedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    expires: 0 // TTL index for auto-deletion
  }
}, {
  timestamps: true
});

// Indexes
alertSchema.index({ type: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ productId: 1 });
alertSchema.index({ locationId: 1 });
alertSchema.index({ isRead: 1 });
alertSchema.index({ isResolved: 1 });
alertSchema.index({ createdAt: -1 });

// Compound indexes
alertSchema.index({ type: 1, severity: 1 });
alertSchema.index({ productId: 1, locationId: 1 });
alertSchema.index({ affectedUsers: 1, isRead: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
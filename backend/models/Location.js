import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  type: {
    type: String,
    enum: ['warehouse', 'store', 'distribution_center'],
    default: 'warehouse'
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
locationSchema.index({ name: 1 });
locationSchema.index({ type: 1 });
locationSchema.index({ isActive: 1 });
locationSchema.index({ managerId: 1 });
locationSchema.index({ createdAt: -1 });

const Location = mongoose.model('Location', locationSchema);

export default Location;
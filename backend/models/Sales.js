import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  customerId: {
    type: String,
    trim: true
  },
  quantitySold: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  saleDate: {
    type: Date,
    required: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  year: {
    type: Number
  },
  quarter: {
    type: Number,
    min: 1,
    max: 4
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6
  },
  seasonality: {
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter']
  },
  salesPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
salesSchema.index({ productId: 1 });
salesSchema.index({ locationId: 1 });
salesSchema.index({ saleDate: -1 });
salesSchema.index({ customerId: 1 });
salesSchema.index({ salesPersonId: 1 });

// Compound indexes
salesSchema.index({ productId: 1, saleDate: -1 });
salesSchema.index({ locationId: 1, saleDate: -1 });
salesSchema.index({ year: 1, month: 1 });
salesSchema.index({ quarter: 1, year: 1 });

const Sales = mongoose.model('Sales', salesSchema);

export default Sales;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['men', 'women', 'children']
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  pricePLN: {
    type: Number,
    required: true
  },
  priceUSD: {
    type: Number,
    required: true
  },
  photos: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  maintenanceInfo: {
    type: String,
    required: true
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);

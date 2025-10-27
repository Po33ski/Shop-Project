const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
    enum: ['men', 'women', 'children']
  },
  bestsellers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  description: {
    type: String,
    required: true
  },
  maintenanceInfo: {
    type: String,
    required: true
  },
  heroImageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Category', categorySchema);

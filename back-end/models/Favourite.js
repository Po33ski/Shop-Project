const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Favourite', favouriteSchema);

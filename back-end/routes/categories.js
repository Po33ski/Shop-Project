const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// GET /categories/:gender - Get category data for specific gender
router.get('/:gender', async (req, res) => {
  try {
    const { gender } = req.params;
    
    // Find category
    const category = await Category.findOne({ gender });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Populate bestsellers with actual product data
    const bestsellers = await Product.find({
      _id: { $in: category.bestsellers },
      isBestseller: true
    });
    
    const response = {
      bestsellers,
      description: category.description,
      maintenanceInfo: category.maintenanceInfo,
      heroImageUrl: category.heroImageUrl
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

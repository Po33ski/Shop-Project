const express = require('express');
const router = express.Router();
const Favourite = require('../models/Favourite');
const Product = require('../models/Product');

// GET /favourites - Get all favourites with product data
router.get('/', async (req, res) => {
  try {
    const favourites = await Favourite.find().sort({ createdAt: -1 });
    
    // Populate product data for each favourite
    const favouritesWithProducts = await Promise.all(
      favourites.map(async (favourite) => {
        const product = await Product.findOne({ id: favourite.productId });
        return {
          ...favourite.toObject(),
          product: product || null // Handle case where product might not exist
        };
      })
    );
    
    res.json(favouritesWithProducts);
  } catch (error) {
    console.error('Error fetching favourites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /favourites - Add product to favourites
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Check if already in favourites
    const existingFavourite = await Favourite.findOne({ productId });
    if (existingFavourite) {
      return res.status(400).json({ error: 'Product already in favourites' });
    }
    
    const favourite = new Favourite({ productId });
    await favourite.save();
    
    res.status(201).json(favourite);
  } catch (error) {
    console.error('Error adding favourite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /favourites/:id - Remove from favourites
router.delete('/:id', async (req, res) => {
  try {
    const favourite = await Favourite.findByIdAndDelete(req.params.id);
    
    if (!favourite) {
      return res.status(404).json({ error: 'Favourite not found' });
    }
    
    res.json({ message: 'Favourite removed successfully' });
  } catch (error) {
    console.error('Error removing favourite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

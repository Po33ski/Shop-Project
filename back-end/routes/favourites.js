const express = require('express');
const router = express.Router();
const Favourite = require('../models/Favourite');

// GET /favourites - Get all favourites
router.get('/', async (req, res) => {
  try {
    const favourites = await Favourite.find().sort({ createdAt: -1 });
    res.json(favourites);
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

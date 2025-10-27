const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
require('dotenv').config();

const AZURE_STORAGE_BASE_URL = process.env.AZURE_STORAGE_BASE_URL || 'https://shopstorage1523.blob.core.windows.net/product-images/';

// GET /women - Get women's category data
router.get('/women', async (req, res) => {
  try {
    // Get bestsellers for women
    const bestsellers = await Product.find({ 
      gender: 'women', 
      isBestseller: true 
    }).limit(6);

    // Get dedicated hero image
    const heroImageUrl = `${AZURE_STORAGE_BASE_URL}women.jpg`;

    res.json({
      bestsellers,
      heroImageUrl
    });
  } catch (error) {
    console.error('Error fetching women category:', error);
    res.status(500).json({ error: 'Failed to fetch women category data' });
  }
});

// GET /men - Get men's category data
router.get('/men', async (req, res) => {
  try {
    // Get bestsellers for men
    const bestsellers = await Product.find({ 
      gender: 'men', 
      isBestseller: true 
    }).limit(6);

    // Get dedicated hero image
    const heroImageUrl = `${AZURE_STORAGE_BASE_URL}men.jpg`;

    res.json({
      bestsellers,
      heroImageUrl
    });
  } catch (error) {
    console.error('Error fetching men category:', error);
    res.status(500).json({ error: 'Failed to fetch men category data' });
  }
});

// GET /children - Get children's category data
router.get('/children', async (req, res) => {
  try {
    // Get bestsellers for children
    const bestsellers = await Product.find({ 
      gender: 'children', 
      isBestseller: true 
    }).limit(6);

    // Get dedicated hero image
    const heroImageUrl = `${AZURE_STORAGE_BASE_URL}children.jpg`;

    res.json({
      bestsellers,
      heroImageUrl
    });
  } catch (error) {
    console.error('Error fetching children category:', error);
    res.status(500).json({ error: 'Failed to fetch children category data' });
  }
});

module.exports = router;
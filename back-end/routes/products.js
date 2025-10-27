const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { gender, category, subcategory, _limit = 10, _page = 1 } = req.query;
    
    // Build filter object
    const filter = {};
    if (gender) filter.gender = gender;
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    
    // Calculate pagination
    const limit = parseInt(_limit);
    const page = parseInt(_page);
    const skip = (page - 1) * limit;
    
    // Get products with pagination
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    
    // Set pagination headers (compatible with json-server)
    res.set({
      'X-Total-Count': totalCount,
      'Access-Control-Expose-Headers': 'X-Total-Count'
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /products - Create new product
router.post('/', async (req, res) => {
  try {
    // Get the highest ID to create a new one
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    
    const product = new Product({
      ...req.body,
      id: newId
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

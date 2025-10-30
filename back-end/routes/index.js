const express = require('express');
const router = express.Router();

// Import route modules
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));

// Category endpoints for frontend compatibility (root level)
router.use('/', require('./categories'));

module.exports = router;

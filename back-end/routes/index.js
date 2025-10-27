const express = require('express');
const router = express.Router();

// Import all route modules
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));
router.use('/favourites', require('./favourites'));
router.use('/upload', require('./upload'));
router.use('/admin', require('./admin'));

// Category endpoints for frontend compatibility (root level)
router.use('/', require('./categories'));

module.exports = router;

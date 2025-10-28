const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const router = express.Router();
const Product = require('../models/Product');

// Helper function to generate safe file names
const generateSafeFileName = (originalName, index) => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);

  // Remove extension and clean the name
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Ensure we have a name
  const finalName = cleanName || 'image';

  return `${timestamp}-${index}-${finalName}.jpg`;
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Only JPG images are allowed'), false);
    }
  }
});

// Initialize Azure Blob Storage (conditional)
let blobServiceClient = null;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'product-images';

if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    console.log('✅ Azure Blob Storage initialized for products');
  } catch (error) {
    console.log('⚠️ Azure Blob Storage error:', error.message);
  }
} else {
  console.log('⚠️ Azure Blob Storage not configured');
}

// Helper function to upload image to Azure
const uploadImageToAzure = async (file, fileName) => {
  if (!blobServiceClient) {
    // Return placeholder URL if Azure is not configured
    return `https://via.placeholder.com/300x400?text=${encodeURIComponent(fileName)}`;
  }

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: file.mimetype
      },
      tags: {
        uploadedAt: new Date().toISOString(),
        source: 'product-upload'
      }
    };

    await blockBlobClient.upload(file.buffer, file.buffer.length, uploadOptions);
    
    const baseUrl = process.env.AZURE_STORAGE_BASE_URL;
    const urlWithSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    
    return `${urlWithSlash}${fileName}`;
  } catch (error) {
    console.error('Error uploading to Azure:', error);
    // Return placeholder URL on error
    return `https://via.placeholder.com/300x400?text=${encodeURIComponent(fileName)}`;
  }
};

// Helper function to delete image from Azure
const deleteImageFromAzure = async (imageUrl) => {
  if (!blobServiceClient) {
    // Skip delete if Azure is not configured
    console.log(`⚠️ Skipping delete (Azure not configured): ${imageUrl}`);
    return true;
  }

  // Skip delete for placeholder URLs
  if (imageUrl.includes('via.placeholder.com')) {
    console.log(`⚠️ Skipping delete (placeholder URL): ${imageUrl}`);
    return true;
  }

  try {
    const fileName = imageUrl.split('/').pop();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.delete();
    console.log(`✅ Deleted image: ${fileName}`);
    return true;
  } catch (error) {
    console.error('Error deleting from Azure:', error);
    // Don't throw error - image might not exist
    return false;
  }
};

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

// POST /products - Create new product (with file upload support)
router.post('/', upload.array('photos', 3), async (req, res) => {
  try {
    const {
      productName,
      price,
      category,
      subcategory,
      gender,
      description,
      brand,
      maintenanceInfo,
      isBestseller = false,
      stock = 0
    } = req.body;

    // Validate required fields
    if (!productName || !price || !category || !gender) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: productName, price, category, gender'
      });
    }

    // Upload images to Azure
    const photoUrls = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const fileName = generateSafeFileName(file.originalname, i);
        const imageUrl = await uploadImageToAzure(file, fileName);
        photoUrls.push(imageUrl);
      }
    }

    // Generate unique ID
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    // Create product
    const productPrice = parseFloat(price);
    const product = new Product({
      id: newId,
      productName,
      price: productPrice,
      pricePLN: productPrice,
      priceUSD: Math.round(productPrice * 0.25 * 100) / 100,
      category,
      subcategory: subcategory || '',
      gender,
      description: description || '',
      brand: brand || 'Unknown',
      maintenanceInfo: maintenanceInfo || 'Brak informacji o pielęgnacji',
      photos: photoUrls,
      isBestseller: isBestseller === 'true' || isBestseller === true,
      stock: parseInt(stock) || 0
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create product'
    });
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

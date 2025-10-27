const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const Product = require('../models/Product');
const router = express.Router();

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

// Initialize Azure Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'product-images';

// Helper function to upload image to Azure
const uploadImageToAzure = async (file, fileName) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    
    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: file.mimetype
      },
      tags: {
        uploadedAt: new Date().toISOString(),
        source: 'admin-upload'
      }
    };

    await blockBlobClient.upload(file.buffer, file.buffer.length, uploadOptions);
    
    const baseUrl = process.env.AZURE_STORAGE_BASE_URL || 
      `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/`;
    
    return `${baseUrl}${fileName}`;
  } catch (error) {
    console.error('Error uploading to Azure:', error);
    throw new Error('Failed to upload image to Azure');
  }
};

// Helper function to delete image from Azure
const deleteImageFromAzure = async (imageUrl) => {
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

// GET /admin/products - Get all products for admin
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// GET /admin/products/:id - Get single product for admin
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// POST /admin/products - Create new product
router.post('/products', upload.array('photos', 5), async (req, res) => {
  try {
    const {
      productName,
      price,
      category,
      subcategory,
      gender,
      description,
      isBestseller = false
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
        const fileName = `${Date.now()}-${i}-${file.originalname}`;
        const imageUrl = await uploadImageToAzure(file, fileName);
        photoUrls.push(imageUrl);
      }
    }

    // Create product
    const product = new Product({
      productName,
      price: parseFloat(price),
      category,
      subcategory,
      gender,
      description,
      photos: photoUrls,
      isBestseller: isBestseller === 'true'
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
      error: 'Failed to create product'
    });
  }
});

// PUT /admin/products/:id - Update product
router.put('/products/:id', upload.array('photos', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const {
      productName,
      price,
      category,
      subcategory,
      gender,
      description,
      isBestseller
    } = req.body;

    // Update fields
    if (productName) product.productName = productName;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (gender) product.gender = gender;
    if (description) product.description = description;
    if (isBestseller !== undefined) product.isBestseller = isBestseller === 'true';

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newPhotoUrls = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const fileName = `${Date.now()}-${i}-${file.originalname}`;
        const imageUrl = await uploadImageToAzure(file, fileName);
        newPhotoUrls.push(imageUrl);
      }
      
      // Add new photos to existing ones
      product.photos = [...product.photos, ...newPhotoUrls];
    }

    await product.save();

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

// DELETE /admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Delete images from Azure
    if (product.photos && product.photos.length > 0) {
      for (const photoUrl of product.photos) {
        await deleteImageFromAzure(photoUrl);
      }
    }

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product'
    });
  }
});

// DELETE /admin/products/:id/photos/:photoIndex - Delete specific photo
router.delete('/products/:id/photos/:photoIndex', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const photoIndex = parseInt(req.params.photoIndex);
    if (photoIndex < 0 || photoIndex >= product.photos.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid photo index'
      });
    }

    // Delete photo from Azure
    const photoUrl = product.photos[photoIndex];
    await deleteImageFromAzure(photoUrl);

    // Remove photo from array
    product.photos.splice(photoIndex, 1);
    await product.save();

    res.json({
      success: true,
      message: 'Photo deleted successfully',
      data: product
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete photo'
    });
  }
});

module.exports = router;

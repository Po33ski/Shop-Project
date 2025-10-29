const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const router = express.Router();
const Product = require('../models/Product');

// Helper function to generate full Azure URL from filename
const generateAzureUrl = (fileName) => {
  if (!fileName) return null;
  
  // If it's already a full URL, return as is (for backward compatibility)
  if (fileName.startsWith('http')) {
    return fileName;
  }
  
  // Generate Azure Storage URL
  const baseUrl = process.env.AZURE_STORAGE_BASE_URL;
  if (baseUrl) {
    const urlWithSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${urlWithSlash}${fileName}`;
  }
  
  // Fallback to placeholder if Azure not configured
  return `https://dummyimage.com/300x400/cccccc/969696.png&text=No+Image`;
};

// Helper function to transform product for frontend
const transformProductForFrontend = (product) => {
  const productObj = product.toObject ? product.toObject() : product;
  
  // Handle photos transformation
  if (productObj.photos && Array.isArray(productObj.photos)) {
    // Check if it's new structure (array of objects) or old structure (array of strings)
    if (productObj.photos.length > 0) {
      const firstPhoto = productObj.photos[0];
      
      if (typeof firstPhoto === 'string') {
        // Old structure - keep as is for backward compatibility
        // Do nothing, photos are already URLs
      } else if (typeof firstPhoto === 'object' && firstPhoto !== null) {
        // Check if it's corrupted data (string converted to object with indices)
        if (firstPhoto.hasOwnProperty('0') && firstPhoto.hasOwnProperty('1')) {
          // Corrupted data - reconstruct string from object indices
          const keys = Object.keys(firstPhoto).filter(key => !isNaN(key)).sort((a, b) => parseInt(a) - parseInt(b));
          const reconstructedUrl = keys.map(key => firstPhoto[key]).join('');
          productObj.photos = [reconstructedUrl];
        } else if (firstPhoto.photoAzureUrl) {
          // New structure - convert to URLs for frontend
          productObj.photos = productObj.photos.map(photo => 
            generateAzureUrl(photo.photoAzureUrl)
          ).filter(url => url !== null);
        }
      }
    }
  }
  
  return productObj;
};

// Helper function to generate safe file names
const generateSafeFileName = (originalName, index) => {
  const timestamp = Date.now();
  
  // Remove extension and clean the name
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Ensure we have a name
  const finalName = cleanName || 'image';

  // Determine file extension based on original file
  const extension = originalName.toLowerCase().includes('.png') ? '.png' : '.jpg';
  
  return `${timestamp}-${index}-${finalName}${extension}`;
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed'), false);
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
    console.log('⚠️ Azure not configured, returning placeholder for:', fileName);
    return `https://dummyimage.com/300x400/cccccc/969696.png&text=No+Image`;
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
    const urlWithSlash = baseUrl && baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    
    return `${urlWithSlash}${fileName}`;
  } catch (error) {
    console.error('Error uploading to Azure:', error);
    // Return placeholder URL on error
    console.log('⚠️ Azure upload failed, returning placeholder for:', fileName);
    return `https://dummyimage.com/300x400/cccccc/969696.png&text=Upload+Failed`;
  }
};

// Helper function to delete image from Azure
const deleteImageFromAzure = async (imageUrl) => {
  if (!blobServiceClient) {
    // Skip delete if Azure is not configured
    console.log(`⚠️ Skipping delete (Azure not configured): ${imageUrl}`);
    return true;
  }

  // Skip delete for placeholder URLs or non-Azure URLs
  if (imageUrl.includes('dummyimage.com') || 
      imageUrl.includes('via.placeholder.com') || 
      imageUrl.includes('placeholder.com') ||
      !imageUrl.includes('blob.core.windows.net')) {
    console.log(`⚠️ Skipping delete (not Azure Storage URL): ${imageUrl}`);
    return true;
  }

  try {
    // Extract filename from URL, removing query parameters
    const urlParts = imageUrl.split('/');
    const fileNameWithQuery = urlParts[urlParts.length - 1];
    const fileName = fileNameWithQuery.split('?')[0]; // Remove query parameters
    
    // Validate filename (should not be empty and should have valid characters)
    if (!fileName || fileName.length < 3) {
      console.log(`⚠️ Invalid filename extracted from URL: ${imageUrl}`);
      return false;
    }
    
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

// Multer error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum is 3 files.'
      });
    }
  }
  
  if (error.message === 'Only JPG and PNG images are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Only JPG and PNG images are allowed'
    });
  }
  
  next(error);
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
    
    // Transform products for frontend
    const transformedProducts = products.map(product => transformProductForFrontend(product));
    
    res.json(transformedProducts);
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
    
    // Transform product for frontend
    const transformedProduct = transformProductForFrontend(product);
    
    res.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /products - Create new product (with file upload support)
router.post('/', upload.fields([{ name: 'photos', maxCount: 3 }]), handleMulterError, async (req, res) => {
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
    const photos = [];
    if (req.files && req.files.photos && req.files.photos.length > 0) {
      for (let i = 0; i < req.files.photos.length; i++) {
        const file = req.files.photos[i];
        const fileName = generateSafeFileName(file.originalname, i);
        const imageUrl = await uploadImageToAzure(file, fileName);
        
        // Create photo object with new structure
        photos.push({
          photoAzureUrl: fileName, // Store only filename, not full URL
          photoName: file.originalname,
          photoIndex: i
        });
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
      photos: photos,
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

// PUT /products/:id - Update product (with file upload support)
router.put('/:id', upload.fields([{ name: 'photos', maxCount: 5 }]), handleMulterError, async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
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
      brand,
      maintenanceInfo,
      isBestseller,
      stock,
      removedPhotos
    } = req.body;

    // Update fields
    if (productName) product.productName = productName;
    if (price) {
      const productPrice = parseFloat(price);
      product.price = productPrice;
      product.pricePLN = productPrice;
      product.priceUSD = Math.round(productPrice * 0.25 * 100) / 100;
    }
    if (category) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (gender) product.gender = gender;
    if (description !== undefined) product.description = description;
    if (brand !== undefined) product.brand = brand;
    if (maintenanceInfo !== undefined) product.maintenanceInfo = maintenanceInfo;
    if (isBestseller !== undefined) product.isBestseller = isBestseller === 'true' || isBestseller === true;
    if (stock !== undefined) product.stock = parseInt(stock) || 0;

    // Handle removed photos
    if (removedPhotos) {
      try {
        const removedPhotosArray = JSON.parse(removedPhotos);
        for (const photoUrl of removedPhotosArray) {
          await deleteImageFromAzure(photoUrl);
        }
        
        // Remove from product photos (handle both old and new structure)
        if (product.photos.length > 0) {
          if (typeof product.photos[0] === 'string') {
            // Old structure - filter by URL
            product.photos = product.photos.filter(photo => !removedPhotosArray.includes(photo));
          } else if (typeof product.photos[0] === 'object' && product.photos[0].photoAzureUrl) {
            // New structure - filter by generated URL
            product.photos = product.photos.filter(photo => {
              const fullUrl = generateAzureUrl(photo.photoAzureUrl);
              return !removedPhotosArray.includes(fullUrl);
            });
          }
        }
      } catch (error) {
        console.error('Error parsing removed photos:', error);
      }
    }

    // Handle new images (only if files are uploaded)
    if (req.files && req.files.photos && req.files.photos.length > 0) {
      const newPhotos = [];
      const currentPhotoCount = product.photos.length;
      
      for (let i = 0; i < req.files.photos.length; i++) {
        const file = req.files.photos[i];
        const fileName = generateSafeFileName(file.originalname, currentPhotoCount + i);
        const imageUrl = await uploadImageToAzure(file, fileName);
        
        // Create photo object with new structure
        newPhotos.push({
          photoAzureUrl: fileName, // Store only filename, not full URL
          photoName: file.originalname,
          photoIndex: currentPhotoCount + i
        });
      }
      
      // Add new photos to existing ones
      product.photos = [...product.photos, ...newPhotos];
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

// DELETE /products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Delete images from Azure (handle both old and new structure)
    if (product.photos && product.photos.length > 0) {
      for (const photo of product.photos) {
        let photoUrl;
        
        if (typeof photo === 'string') {
          // Old structure - photo is URL
          photoUrl = photo;
        } else if (typeof photo === 'object' && photo.photoAzureUrl) {
          // New structure - generate URL from filename
          photoUrl = generateAzureUrl(photo.photoAzureUrl);
        }
        
        if (photoUrl) {
          await deleteImageFromAzure(photoUrl);
        }
      }
    }

    // Delete product from database
    await Product.deleteOne({ id: parseInt(req.params.id) });

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

// DELETE /products/:id/photos/:photoIndex - Delete specific photo
router.delete('/:id/photos/:photoIndex', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
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

    // Delete photo from Azure (handle both old and new structure)
    const photo = product.photos[photoIndex];
    let photoUrl;
    
    if (typeof photo === 'string') {
      // Old structure - photo is URL
      photoUrl = photo;
    } else if (typeof photo === 'object' && photo.photoAzureUrl) {
      // New structure - generate URL from filename
      photoUrl = generateAzureUrl(photo.photoAzureUrl);
    }
    
    if (photoUrl) {
      await deleteImageFromAzure(photoUrl);
    }

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
module.exports.transformProductForFrontend = transformProductForFrontend;
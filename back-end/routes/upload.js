const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Initialize Azure Blob Service Client
let blobServiceClient;
try {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString || connectionString === 'your_connection_string_here') {
    console.warn('⚠️ Azure Storage connection string not configured');
    blobServiceClient = null;
  } else {
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }
} catch (error) {
  console.warn('⚠️ Azure Storage connection failed:', error.message);
  blobServiceClient = null;
}

const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'product-images';

// POST /upload - Upload single image
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!blobServiceClient) {
      return res.status(500).json({ 
        error: 'Azure Storage not configured',
        message: 'Please configure AZURE_STORAGE_CONNECTION_STRING in .env file'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const extension = path.extname(originalName);
    const fileName = `product-${timestamp}-${Math.random().toString(36).substring(7)}${extension}`;

    // Get container client
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // Create container if it doesn't exist
    await containerClient.createIfNotExists({
      access: 'blob'
    });

    // Get block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Upload file to Azure Blob Storage
    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype
      }
    };

    await blockBlobClient.upload(req.file.buffer, req.file.size, uploadOptions);

    // Return the public URL
    const imageUrl = blockBlobClient.url;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    });
  }
});

// POST /upload/multiple - Upload multiple images
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: 'blob' });

    const uploadPromises = req.files.map(async (file, index) => {
      const timestamp = Date.now();
      const originalName = file.originalname;
      const extension = path.extname(originalName);
      const fileName = `product-${timestamp}-${index}-${Math.random().toString(36).substring(7)}${extension}`;

      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      
      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: file.mimetype
        }
      };

      await blockBlobClient.upload(file.buffer, file.size, uploadOptions);
      
      return {
        fileName: fileName,
        imageUrl: blockBlobClient.url
      };
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      images: results
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload images',
      details: error.message 
    });
  }
});

// DELETE /upload/:fileName - Delete image
router.delete('/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    
    await blockBlobClient.delete();
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image',
      details: error.message 
    });
  }
});

// GET /upload/list - List all images
router.get('/list', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({
        name: blob.name,
        url: `${containerClient.url}/${blob.name}`,
        size: blob.properties.contentLength,
        lastModified: blob.properties.lastModified
      });
    }

    res.json({
      success: true,
      images: blobs
    });

  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ 
      error: 'Failed to list images',
      details: error.message 
    });
  }
});

module.exports = router;

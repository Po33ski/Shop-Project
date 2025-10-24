const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
require('dotenv').config();

// Initialize Azure Blob Service Client
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'product-images';

// Function to extract tags from existing filename
const extractTagsFromExistingFilename = (filename) => {
  const tags = {};
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  const nameParts = nameWithoutExt.toLowerCase().split(/[-_\s]+/);
  
  // Extract category from filename
  if (nameParts.includes('children') || nameParts.includes('child')) {
    tags.category = 'children';
  } else if (nameParts.includes('women') || nameParts.includes('woman')) {
    tags.category = 'women';
  } else if (nameParts.includes('men') || nameParts.includes('man')) {
    tags.category = 'men';
  } else {
    tags.category = 'uncategorized';
  }
  
  // Extract product type
  const productTypes = ['shoes', 'trousers', 'dress', 'shirt', 'jacket', 'skirt', 'blouse', 'jeans'];
  for (const part of nameParts) {
    if (productTypes.includes(part)) {
      tags['product-type'] = part;
      break;
    }
  }
  
  // Default values
  if (!tags['product-type']) tags['product-type'] = 'unknown';
  tags.color = 'unknown';
  tags.size = 'unknown';
  tags.brand = 'unknown';
  
  return tags;
};

// Function to upload single file with original name
const uploadFileWithOriginalName = async (filePath, originalFilename) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const tags = extractTagsFromExistingFilename(originalFilename);
    
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(originalFilename);
    
    const uploadOptions = {
      tags: tags,
      blobHTTPHeaders: {
        blobContentType: 'image/jpeg' // or detect from file extension
      }
    };
    
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions);
    
    const url = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME || 'shopstorage1523'}.blob.core.windows.net/${containerName}/${originalFilename}`;
    
    return {
      success: true,
      url: url,
      tags: tags,
      filename: originalFilename
    };
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return {
      success: false,
      error: error.message,
      filename: originalFilename
    };
  }
};

// Function to update products in MongoDB with new Azure URLs
const updateProductsWithAzureUrls = async (uploadResults) => {
  try {
    console.log('🔄 Updating products in MongoDB with Azure URLs...');
    
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products in database`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      if (product.photos && product.photos.length > 0) {
        // Check if current photo is a local path that needs to be updated
        const currentPhoto = product.photos[0];
        if (currentPhoto && currentPhoto.includes('/product-photos/')) {
          // Extract filename from current path
          const currentFilename = path.basename(currentPhoto);
          
          // Find matching Azure URL
          const matchingUpload = uploadResults.find(result => 
            result.success && result.filename === currentFilename
          );
          
          if (matchingUpload) {
            product.photos = [matchingUpload.url];
            await product.save();
            updatedCount++;
            console.log(`✅ Updated product: ${product.name}`);
            console.log(`   Old: ${currentPhoto}`);
            console.log(`   New: ${matchingUpload.url}`);
          } else {
            console.log(`⚠️ No Azure URL found for: ${currentFilename}`);
          }
        }
      }
    }
    
    console.log(`✅ Updated ${updatedCount} products with Azure URLs!`);
  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
};

// Main migration function
const migrateImages = async () => {
  try {
    console.log('🚀 Starting image migration from back-end-old to Azure Storage...');
    
    const sourceDir = '/home/jarek/projects/Shop-Project/back-end-old/public/product-photos';
    
    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ Source directory not found: ${sourceDir}`);
      return;
    }
    
    // Get all image files
    const files = fs.readdirSync(sourceDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    console.log(`📁 Found ${imageFiles.length} images to migrate`);
    
    if (imageFiles.length === 0) {
      console.log('⚠️ No images found in source directory');
      return;
    }
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const filename of imageFiles) {
      const filePath = path.join(sourceDir, filename);
      console.log(`📤 Migrating: ${filename}`);
      
      const result = await uploadFileWithOriginalName(filePath, filename);
      results.push(result);
      
      if (result.success) {
        successCount++;
        console.log(`✅ Migrated: ${result.url}`);
        console.log(`🏷️ Tags:`, result.tags);
      } else {
        errorCount++;
        console.log(`❌ Failed: ${result.error}`);
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📁 Total: ${imageFiles.length}`);
    
    // Save results to file
    const resultsFile = path.join(__dirname, 'migration-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`📄 Results saved to: ${resultsFile}`);
    
    // Update products in MongoDB
    if (successCount > 0) {
      console.log('\n🔄 Updating MongoDB products...');
      await updateProductsWithAzureUrls(results);
    }
    
    return results;
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
};

// CLI interface
const main = async () => {
  console.log('🖼️ Image Migration: back-end-old → Azure Storage');
  console.log('================================================');
  console.log(`📁 Source: /home/jarek/projects/Shop-Project/back-end-old/public/product-photos`);
  console.log(`☁️ Destination: Azure Blob Storage (${containerName})`);
  console.log('');
  
  const results = await migrateImages();
  
  if (results && results.length > 0) {
    console.log('\n🎉 Migration completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Check Azure Portal to verify uploaded images');
    console.log('2. Test your frontend to ensure images load correctly');
    console.log('3. Remove old images from back-end-old if everything works');
  }
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { migrateImages, uploadFileWithOriginalName };

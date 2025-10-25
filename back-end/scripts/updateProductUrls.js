const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop-db';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to update product URLs from local paths to Azure URLs
const updateProductUrls = async () => {
  try {
    console.log('🔄 Updating product URLs from local paths to Azure URLs...');
    
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      if (product.photos && product.photos.length > 0) {
        const updatedPhotos = product.photos.map(photo => {
          // Convert local paths to Azure URLs
          if (photo.startsWith('/product-photos/')) {
            const filename = photo.replace('/product-photos/', '');
            return `https://shopstorage1523.blob.core.windows.net/product-images/${filename}`;
          }
          return photo; // Keep as is if already Azure URL
        });
        
        // Only update if there are changes
        if (JSON.stringify(updatedPhotos) !== JSON.stringify(product.photos)) {
          product.photos = updatedPhotos; 
          await product.save();
          updatedCount++;
          console.log(`✅ Updated product: ${product.productName}`);
          console.log(`   Old: ${product.photos.join(', ')}`);
          console.log(`   New: ${updatedPhotos.join(', ')}`);
        }
      }
    }
    
    console.log(`✅ Updated ${updatedCount} products with Azure URLs!`);
  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
};

// Main function
const main = async () => {
  console.log('🔄 Product URL Update: Local → Azure Storage');
  console.log('============================================');
  
  await connectDB();
  await updateProductUrls();
  
  console.log('\n🎉 URL update completed!');
  mongoose.disconnect();
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { updateProductUrls };

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

// Available images in Azure Storage
const availableImages = [
  'children-shoes-1.jpg',
  'children-shoes-2.jpg', 
  'children-shoes-3.jpg',
  'children-trousers-1.jpg',
  'children-trousers-2.jpg',
  'children-trousers-3.jpg',
  'children.jpg',
  'man-bag-1.jpg',
  'man-bag-2.jpg',
  'man-shoes-1.jpg',
  'man-shoes-2.jpg',
  'man-shoes-3.jpg',
  'man-shorts-1.JPG',
  'man-shorts-2.jpg',
  'man-t-shirt-1.jpg',
  'man-t-shirt-2.jpg',
  'man-t-shirt-3.jpg',
  'man-t-shirt-4.jpg',
  'man-watch-1.jpg',
  'men.jpg',
  'women-shoes-1.jpg',
  'women-shoes-2.jpg',
  'women-shorts-1.jpg',
  'women-sweater-1.jpg',
  'women-trousers-1.jpg',
  'women-trousers-3.jpg',
  'women.jpg',
  'womens-shoes-3.jpg'
];

// Function to find matching images for a product
const findMatchingImages = (product) => {
  const matches = [];
  
  // Match by gender and product type
  if (product.gender === 'men') {
    if (product.subcategory === 'koszulki' || product.productName.toLowerCase().includes('t-shirt')) {
      matches.push('man-t-shirt-1.jpg', 'man-t-shirt-2.jpg', 'man-t-shirt-3.jpg', 'man-t-shirt-4.jpg');
    } else if (product.subcategory === 'spodnie' || product.productName.toLowerCase().includes('jeans')) {
      // We don't have men's trousers images, so use shorts as closest match
      matches.push('man-shorts-1.JPG', 'man-shorts-2.jpg');
    } else if (product.subcategory === 'obuwie' || product.productName.toLowerCase().includes('sneakers')) {
      matches.push('man-shoes-1.jpg', 'man-shoes-2.jpg', 'man-shoes-3.jpg');
    } else {
      matches.push('man-bag-1.jpg', 'man-watch-1.jpg');
    }
  } else if (product.gender === 'women') {
    if (product.subcategory === 'sukienki' || product.productName.toLowerCase().includes('sukienka')) {
      // Use appropriate dress images - we don't have specific dress images, so use general women's clothing
      matches.push('women-sweater-1.jpg', 'women-shorts-1.jpg');
    } else if (product.subcategory === 'obuwie' || product.productName.toLowerCase().includes('szpilki')) {
      matches.push('women-shoes-1.jpg', 'women-shoes-2.jpg', 'womens-shoes-3.jpg');
    } else if (product.subcategory === 'spodnie' || product.productName.toLowerCase().includes('trousers')) {
      matches.push('women-trousers-1.jpg', 'women-trousers-3.jpg');
    } else if (product.subcategory === 'bluzki' || product.productName.toLowerCase().includes('bluzka')) {
      // Use sweater for blouse as closest match
      matches.push('women-sweater-1.jpg');
    } else {
      matches.push('women-shorts-1.jpg', 'women-sweater-1.jpg');
    }
  } else if (product.gender === 'children') {
    if (product.subcategory === 'obuwie' || product.productName.toLowerCase().includes('buty')) {
      matches.push('children-shoes-1.jpg', 'children-shoes-2.jpg', 'children-shoes-3.jpg');
    } else if (product.subcategory === 'spodnie' || product.productName.toLowerCase().includes('trousers')) {
      matches.push('children-trousers-1.jpg', 'children-trousers-2.jpg', 'children-trousers-3.jpg');
    } else {
      matches.push('children.jpg');
    }
  }
  
  // Filter to only include images that actually exist
  return matches.filter(img => availableImages.includes(img));
};

// Function to update product images
const updateProductImages = async () => {
  try {
    console.log('🔄 Updating product images with available Azure images...');
    
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      const matchingImages = findMatchingImages(product);
      
      if (matchingImages.length > 0) {
        // Convert to Azure URLs
        const azureUrls = matchingImages.map(img => 
          `https://shopstorage1523.blob.core.windows.net/product-images/${img}`
        );
        
        product.photos = azureUrls;
        await product.save();
        updatedCount++;
        
        console.log(`✅ Updated product: ${product.productName}`);
        console.log(`   Gender: ${product.gender}, Category: ${product.subcategory}`);
        console.log(`   Images: ${azureUrls.join(', ')}`);
      } else {
        console.log(`⚠️ No matching images for: ${product.productName}`);
      }
    }
    
    console.log(`✅ Updated ${updatedCount} products with Azure images!`);
  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
};

// Main function
const main = async () => {
  console.log('🖼️ Fix Product Images: Map to Available Azure Images');
  console.log('==================================================');
  
  await connectDB();
  await updateProductImages();
  
  console.log('\n🎉 Product images fixed!');
  mongoose.disconnect();
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { updateProductImages };

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Product = require('../models/Product');
const Category = require('../models/Category');

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

// Load JSON data
const loadJsonData = () => {
  const jsonPath = path.join(__dirname, '../../back-end/db.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return jsonData;
};

// Migrate products
const migrateProducts = async (jsonData) => {
  console.log('🔄 Migrating products...');
  
  // Clear existing products
  await Product.deleteMany({});
  
  const products = [];
  
  // Process products from JSON
  if (jsonData.products) {
    for (const product of jsonData.products) {
      products.push({
        ...product,
        isBestseller: false,
        stock: Math.floor(Math.random() * 100) + 1 // Random stock
      });
    }
  }
  
  // Process bestsellers
  if (jsonData.women && jsonData.women.bestsellers) {
    for (const product of jsonData.women.bestsellers) {
      products.push({
        ...product,
        isBestseller: true,
        stock: Math.floor(Math.random() * 100) + 1
      });
    }
  }
  
  if (jsonData.men && jsonData.men.bestsellers) {
    for (const product of jsonData.men.bestsellers) {
      products.push({
        ...product,
        isBestseller: true,
        stock: Math.floor(Math.random() * 100) + 1
      });
    }
  }
  
  if (jsonData.children && jsonData.children.bestsellers) {
    for (const product of jsonData.children.bestsellers) {
      products.push({
        ...product,
        isBestseller: true,
        stock: Math.floor(Math.random() * 100) + 1
      });
    }
  }
  
  // Insert products
  await Product.insertMany(products);
  console.log(`✅ Migrated ${products.length} products`);
};

// Migrate categories
const migrateCategories = async (jsonData) => {
  console.log('🔄 Migrating categories...');
  
  // Clear existing categories
  await Category.deleteMany({});
  
  const categories = [];
  
  // Process each gender category
  const genders = ['women', 'men', 'children'];
  
  for (const gender of genders) {
    if (jsonData[gender]) {
      const categoryData = jsonData[gender];
      
      // Find bestseller product IDs
      const bestsellerProducts = await Product.find({
        gender: gender,
        isBestseller: true
      }).select('_id');
      
      categories.push({
        gender,
        bestsellers: bestsellerProducts.map(p => p._id),
        description: categoryData.description || '',
        maintenanceInfo: categoryData.maintenanceInfo || '',
        heroImageUrl: categoryData.heroImageUrl || ''
      });
    }
  }
  
  // Insert categories
  await Category.insertMany(categories);
  console.log(`✅ Migrated ${categories.length} categories`);
};

// Main migration function
const migrate = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting data migration...');
    
    const jsonData = loadJsonData();
    
    await migrateProducts(jsonData);
    await migrateCategories(jsonData);
    
    console.log('✅ Migration completed successfully!');
    
    // Show some stats
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    console.log(`📊 Final stats:`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Categories: ${categoryCount}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

// Run migration if called directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;

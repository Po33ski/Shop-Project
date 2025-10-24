const mongoose = require('mongoose');
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

// Sample products data
const sampleProducts = [
  // Men's products
  {
    id: 1,
    gender: 'men',
    category: 'odziez',
    subcategory: 'koszulki',
    productName: 'Biały T-Shirt',
    brand: 'Top Brand',
    pricePLN: 49,
    priceUSD: 10,
    photos: [
      '/product-photos/man-t-shirt-1.jpg',
      '/product-photos/man-t-shirt-2.jpg',
      '/product-photos/man-t-shirt-3.jpg'
    ],
    description: 'Klasyczny biały t-shirt z wysokiej jakości bawełny. Idealny na co dzień.',
    maintenanceInfo: 'Pranie w 30°C, nie wybielać, prasować w niskiej temperaturze.',
    isBestseller: true,
    stock: 50
  },
  {
    id: 2,
    gender: 'men',
    category: 'odziez',
    subcategory: 'spodnie',
    productName: 'Jeansy',
    brand: 'Denim Co',
    pricePLN: 199,
    priceUSD: 49,
    photos: [
      '/product-photos/man-jeans-1.jpg',
      '/product-photos/man-jeans-2.jpg'
    ],
    description: 'Klasyczne niebieskie jeansy z elastycznej denimu.',
    maintenanceInfo: 'Pranie w 40°C, suszenie naturalne.',
    isBestseller: true,
    stock: 30
  },
  {
    id: 3,
    gender: 'men',
    category: 'obuwie',
    subcategory: 'sportowe',
    productName: 'Sneakers',
    brand: 'SportMax',
    pricePLN: 299,
    priceUSD: 69,
    photos: [
      '/product-photos/man-sneakers-1.jpg',
      '/product-photos/man-sneakers-2.jpg'
    ],
    description: 'Wygodne sneakers do codziennego użytku.',
    maintenanceInfo: 'Czyszczenie wilgotną szmatką, suszenie naturalne.',
    isBestseller: false,
    stock: 25
  },
  // Women's products
  {
    id: 4,
    gender: 'women',
    category: 'odziez',
    subcategory: 'sukienki',
    productName: 'Letnia sukienka',
    brand: 'Fashion Style',
    pricePLN: 149,
    priceUSD: 35,
    photos: [
      '/product-photos/women-dress-1.jpg',
      '/product-photos/women-dress-2.jpg'
    ],
    description: 'Elegancka letnia sukienka w kwiatowym wzorze.',
    maintenanceInfo: 'Pranie w 30°C, prasowanie w niskiej temperaturze.',
    isBestseller: true,
    stock: 40
  },
  {
    id: 5,
    gender: 'women',
    category: 'obuwie',
    subcategory: 'eleganckie',
    productName: 'Szpilki',
    brand: 'Elegant Shoes',
    pricePLN: 199,
    priceUSD: 49,
    photos: [
      '/product-photos/women-heels-1.jpg',
      '/product-photos/women-heels-2.jpg'
    ],
    description: 'Eleganckie szpilki na specjalne okazje.',
    maintenanceInfo: 'Czyszczenie specjalnymi środkami do skóry.',
    isBestseller: true,
    stock: 20
  },
  {
    id: 6,
    gender: 'women',
    category: 'odziez',
    subcategory: 'bluzki',
    productName: 'Elegancka bluzka',
    brand: 'Office Style',
    pricePLN: 89,
    priceUSD: 22,
    photos: [
      '/product-photos/women-blouse-1.jpg'
    ],
    description: 'Elegancka bluzka do biura i na co dzień.',
    maintenanceInfo: 'Pranie w 30°C, prasowanie w średniej temperaturze.',
    isBestseller: false,
    stock: 35
  },
  // Children's products
  {
    id: 7,
    gender: 'children',
    category: 'odziez',
    subcategory: 'koszulki',
    productName: 'Kolorowa koszulka',
    brand: 'Kids Fun',
    pricePLN: 29,
    priceUSD: 7,
    photos: [
      '/product-photos/child-shirt-1.jpg',
      '/product-photos/child-shirt-2.jpg'
    ],
    description: 'Kolorowa koszulka dla dzieci z zabawnym nadrukiem.',
    maintenanceInfo: 'Pranie w 40°C, bezpieczne dla dzieci.',
    isBestseller: true,
    stock: 60
  },
  {
    id: 8,
    gender: 'children',
    category: 'obuwie',
    subcategory: 'sportowe',
    productName: 'Buty sportowe',
    brand: 'Kids Sport',
    pricePLN: 99,
    priceUSD: 24,
    photos: [
      '/product-photos/child-shoes-1.jpg'
    ],
    description: 'Wygodne buty sportowe dla dzieci.',
    maintenanceInfo: 'Czyszczenie wilgotną szmatką.',
    isBestseller: false,
    stock: 45
  }
];

// Sample categories data
const sampleCategories = [
  {
    gender: 'men',
    description: 'Modna odzież męska dla każdego stylu życia.',
    maintenanceInfo: 'Wszystkie produkty są wysokiej jakości i łatwe w pielęgnacji.',
    heroImageUrl: '/product-photos/men-hero.jpg'
  },
  {
    gender: 'women',
    description: 'Elegancka odzież damska na każdą okazję.',
    maintenanceInfo: 'Produkty zaprojektowane z myślą o komforcie i stylu.',
    heroImageUrl: '/product-photos/women-hero.jpg'
  },
  {
    gender: 'children',
    description: 'Kolorowa i wygodna odzież dla dzieci.',
    maintenanceInfo: 'Bezpieczne materiały, idealne dla delikatnej skóry dzieci.',
    heroImageUrl: '/product-photos/children-hero.jpg'
  }
];

// Clear existing data
const clearData = async () => {
  console.log('🗑️ Clearing existing data...');
  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log('✅ Data cleared');
};

// Add products
const addProducts = async () => {
  console.log('🔄 Adding products...');
  await Product.insertMany(sampleProducts);
  console.log(`✅ Added ${sampleProducts.length} products`);
};

// Add categories with bestsellers
const addCategories = async () => {
  console.log('🔄 Adding categories...');
  
  for (const categoryData of sampleCategories) {
    // Find bestseller products for this gender
    const bestsellerProducts = await Product.find({
      gender: categoryData.gender,
      isBestseller: true
    }).select('_id');
    
    const category = new Category({
      ...categoryData,
      bestsellers: bestsellerProducts.map(p => p._id)
    });
    
    await category.save();
  }
  
  console.log(`✅ Added ${sampleCategories.length} categories`);
};

// Main function
const seedData = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting data seeding...');
    
    await clearData();
    await addProducts();
    await addCategories();
    
    console.log('✅ Data seeding completed successfully!');
    
    // Show stats
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const bestsellerCount = await Product.countDocuments({ isBestseller: true });
    
    console.log(`📊 Final stats:`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Categories: ${categoryCount}`);
    console.log(`   - Bestsellers: ${bestsellerCount}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;

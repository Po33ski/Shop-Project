# 🛍️ E-Commerce Shop

A full-stack e-commerce application built with React, Vite, Node.js, MongoDB, and Azure Blob Storage. Features shopping cart, favorites, admin panel, and dynamic product browsing.

## ✨ Features

- 👕 Browse products by **gender** and **category** (Women, Men, Children)
- 🛒 **Shopping Cart** with quantity management
- ❤️ **Favorites** system
- 🧭 **Breadcrumb navigation**
- 📱 **Responsive design** based on Figma mockup
- 🎨 Modern UI with Accordion components
- 🔧 **Admin Panel** for product management
- ☁️ **Cloud Storage** for product images (Azure Blob Storage)
- 🗄️ **MongoDB** database for data persistence

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + React Router DOM
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Database**: MongoDB Atlas (Cloud)
- **Storage**: Azure Blob Storage (Product Images)
- **Deployment**: Ready for cloud hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Azure Storage account (free tier available)

### Local Development

1. **Clone and install:**
```bash
git clone <repository-url>
cd Shop-Project
npm install
```

2. **Configure environment variables:**
```bash
# Copy environment template
cp back-end/.env.example back-end/.env

# Edit back-end/.env with your credentials:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop-db
# AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
# AZURE_STORAGE_CONTAINER_NAME=product-images
# AZURE_STORAGE_BASE_URL=https://yourstorageaccount.blob.core.windows.net/product-images/
```

3. **Run the application:**
```bash
npm run dev
```

This starts both frontend (http://localhost:5174) and backend (http://localhost:3000).

### Other Commands

- `npm run front-end` - Run only frontend
- `npm run back-end` - Run only backend
- `npm run reset` - Reset database to original state

## 📁 Project Structure

```
Shop-Project/
├── front-end/              # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── views/          # Page views
│   │   ├── api/            # API loaders/actions
│   │   └── contexts/       # React contexts
│   └── vite.config.js
├── back-end/               # Node.js + Express API
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Express server
│   └── .env                # Environment variables
└── package.json            # Workspace configuration
```

## 🔧 Configuration

### API Endpoints

Backend provides these endpoints:
- `GET /products` - All products with filtering
- `GET /products/:id` - Single product
- `GET /women` - Women's products
- `GET /men` - Men's products
- `GET /children` - Children's products
- `GET /favourites` - User favorites
- `POST /admin/products` - Add new product (Admin)
- `PUT /admin/products/:id` - Update product (Admin)
- `DELETE /admin/products/:id` - Delete product (Admin)

### Environment Variables

Required environment variables in `back-end/.env`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop-db

# Server Configuration
PORT=3000

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_CONTAINER_NAME=product-images
AZURE_STORAGE_BASE_URL=https://yourstorageaccount.blob.core.windows.net/product-images/

# Environment
NODE_ENV=development
```

## 🗄️ Database Schema

### Product Model

```javascript
{
  id: Number,           // Unique product ID
  gender: String,        // 'men', 'women', 'children'
  category: String,      // 'odziez', 'obuwie', 'akcesoria'
  subcategory: String,   // 'koszulki', 'spodnie', 'sneakersy', etc.
  productName: String,   // Product name
  brand: String,         // Brand name
  price: Number,         // Price in PLN
  pricePLN: Number,      // Price in PLN (legacy)
  priceUSD: Number,      // Price in USD (legacy)
  photos: [String],      // Array of Azure Blob Storage URLs
  description: String,   // Product description
  maintenanceInfo: String, // Care instructions
  isBestseller: Boolean, // Bestseller flag
  stock: Number,         // Stock quantity
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

## 🔧 Admin Panel

The admin panel provides full CRUD operations for products:

- **Add Products**: Upload images, set prices, categories
- **Edit Products**: Modify existing product details
- **Delete Products**: Remove products and their images
- **Image Management**: Automatic upload to Azure Blob Storage

### Admin Routes

- `/admin` - Admin dashboard
- `/admin/products` - Product list
- `/admin/products/add` - Add new product
- `/admin/products/edit/:id` - Edit product

## ☁️ Cloud Services

### MongoDB Atlas

- **Free Tier**: 512MB storage, shared clusters
- **Features**: Automatic backups, scaling, monitoring
- **Security**: IP whitelisting, user authentication

### Azure Blob Storage

- **Free Tier**: 5GB storage, 20,000 operations/month
- **Features**: CDN integration, versioning, lifecycle management
- **Security**: Access keys, SAS tokens, RBAC

## 🚀 Deployment

### Environment Setup

1. **MongoDB Atlas**:
   - Create cluster
   - Add database user
   - Whitelist IP addresses
   - Get connection string

2. **Azure Storage**:
   - Create storage account
   - Create container
   - Get connection string
   - Configure CORS

### Production Deployment

The application is ready for deployment on:
- **Vercel** (Frontend + Serverless Functions)
- **Railway** (Full-stack)
- **Heroku** (Full-stack)
- **DigitalOcean** (VPS)

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop-db
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_CONTAINER_NAME=product-images
AZURE_STORAGE_BASE_URL=https://yourstorageaccount.blob.core.windows.net/product-images/
NODE_ENV=production
PORT=3000
```

## 📊 Performance

- **Lazy Loading**: Images load on demand
- **Caching**: Azure CDN for static assets
- **Database**: MongoDB indexes for fast queries
- **Frontend**: Vite build optimization

## 🔒 Security

- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Sensitive data in .env files
- **Input Validation**: Mongoose schema validation
- **File Upload**: JPG format validation, size limits

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check MONGODB_URI format
   - Verify IP whitelist
   - Check user permissions

2. **Azure Storage Error**:
   - Verify connection string
   - Check container exists
   - Verify CORS settings

3. **Image Upload Issues**:
   - Check file format (JPG only)
   - Verify file size limits
   - Check Azure permissions

### Debug Mode

Enable debug logging:
```bash
NODE_ENV=development npm run dev
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built as a learning project showcasing modern web development practices with cloud services.

## 🌐 Live Demo

Deploy your own instance using the cloud services mentioned above!

---

**Note**: This project uses cloud services (MongoDB Atlas + Azure) which offer free tiers suitable for development and small-scale production use.
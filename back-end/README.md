# Shop Backend - MongoDB

E-commerce backend with MongoDB and Azure Blob Storage.

## Setup

### 1. MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (FREE tier)
4. Copy the connection string

### 2. Installation

```bash
npm install
```

### 3. Configuration

Copy `env.example` to `.env` and fill in:

```bash
cp env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop-db
PORT=3000
AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
AZURE_STORAGE_CONTAINER_NAME=product-images
```

### 4. Add sample data

```bash
npm run seed
```

### 5. Running

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /products` - Product list (with filtering and pagination)
- `GET /products/:id` - Single product
- `POST /products` - Add product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /categories/:gender` - Category (women/men/children)
- `GET /favourites` - Favourites
- `POST /favourites` - Add to favourites
- `DELETE /favourites/:id` - Remove from favourites

### Image Upload Endpoints

- `POST /upload/single` - Upload single image
- `POST /upload/multiple` - Upload multiple images
- `DELETE /upload/:fileName` - Delete image
- `GET /upload/list` - List all images

## Frontend compatibility

Backend is fully compatible with the current frontend - uses the same endpoints as json-server.

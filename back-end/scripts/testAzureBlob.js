const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

// Test Azure Blob Storage connection
const testAzureBlob = async () => {
  try {
    console.log('🔍 Testing Azure Blob Storage connection...');
    
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'product-images';
    
    if (!connectionString || connectionString === 'your_connection_string_here') {
      console.error('❌ Azure Storage connection string not configured!');
      console.log('Please update AZURE_STORAGE_CONNECTION_STRING in .env file');
      return;
    }
    
    // Initialize Blob Service Client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    
    // Test connection by listing containers
    console.log('📦 Listing containers...');
    const containers = [];
    for await (const container of blobServiceClient.listContainers()) {
      containers.push(container.name);
    }
    
    console.log(`✅ Found ${containers.length} containers:`, containers);
    
    // Test container access
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    try {
      // Try to create container if it doesn't exist
      await containerClient.createIfNotExists({
        access: 'blob'
      });
      console.log(`✅ Container '${containerName}' is accessible`);
    } catch (error) {
      console.error(`❌ Cannot access container '${containerName}':`, error.message);
      return;
    }
    
    // List blobs in container
    console.log(`📋 Listing blobs in '${containerName}'...`);
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({
        name: blob.name,
        size: blob.properties.contentLength,
        lastModified: blob.properties.lastModified
      });
    }
    
    console.log(`✅ Found ${blobs.length} blobs in container`);
    if (blobs.length > 0) {
      console.log('📄 Blobs:', blobs.map(b => `${b.name} (${b.size} bytes)`));
    }
    
    console.log('🎉 Azure Blob Storage connection test successful!');
    
  } catch (error) {
    console.error('❌ Azure Blob Storage test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Run test if called directly
if (require.main === module) {
  testAzureBlob();
}

module.exports = testAzureBlob;

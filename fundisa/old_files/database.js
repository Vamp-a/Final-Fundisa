// database/connection.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config(); // For environment variables

// Validate critical environment variables before proceeding
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
  throw new Error('Missing MongoDB connection environment variables');
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;

// Singleton client pattern 
let cachedClient = null;

async function createMongoClient() {
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 10, // Optimal pool size
    socketTimeoutMS: 30000, // 30 seconds
    connectTimeoutMS: 30000, // 30 seconds
    retryWrites: true,
    retryReads: true
  });
}

async function connectToDatabase() {
  if (cachedClient) {
    console.log('Using cached MongoDB client');
    return cachedClient;
  }

  const client = await createMongoClient();
  
  try {
    await client.connect();
    
    // Verify connection
    await client.db('admin').command({ ping: 1 });
    console.log('Successfully connected to MongoDB Atlas');
    
    // Cache the client
    cachedClient = client;
    
    // Set up cleanup on process termination
    process.on('SIGINT', async () => {
      await gracefulShutdown();
      process.exit(0);
    });
    
    return client;
  } catch (error) {
    console.error( 'MongoDB connection error:', error);
    await client.close();
    throw error; 
  }
}

async function gracefulShutdown() {
  if (cachedClient) {
    console.log('Closing MongoDB connection');
    await cachedClient.close();
    cachedClient = null;
  }
}

// Export the connection function and graceful shutdown
module.exports = {
  connectToDatabase,
  gracefulShutdown
};
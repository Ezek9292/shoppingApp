import mongoose from 'mongoose';
import { initializeProducts } from '../controllers/productController.js';

const { MONGODB_URI } = process.env;

// MongoDB Connection with timeout
const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set.');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.log('Continuing without database in non-production mode.');
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected');
    // Initialize sample products
    await initializeProducts();
    console.log('✓ Database initialized');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.log('Continuing without database in non-production mode. Some features may not work.');
  }
};

export default connectDB;

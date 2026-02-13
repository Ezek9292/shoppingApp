import mongoose from 'mongoose';
import { initializeProducts } from '../controllers/productController.js';

const { MONGODB_URI } = process.env;

// MongoDB Connection with timeout
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const connection = await mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/shopping_app', {
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
    console.log('Continuing without database... Some features may not work.');
    // Don't exit - allow server to run even if DB fails
  }
};

export default connectDB;
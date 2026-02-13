import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productRoutes from './routes/products.js';
import checkoutRoutes from './routes/checkout.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import connectDB from './config/db.js';


const app = express();
const { PORT = 5000, MONGODB_URI } = process.env;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', checkoutRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Shopping App API' });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.js';
import checkoutRoutes from './routes/checkout.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import connectDB from './config/db.js';


const app = express();
const { PORT = 5000, CORS_ORIGIN } = process.env;

connectDB();

// Middleware
const allowedOrigins = CORS_ORIGIN ? CORS_ORIGIN.split(',').map(origin => origin.trim()) : [];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman or mobile apps)
    if(!origin) return callback(null, true);

    if(allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'), false);
    }
  },
  credentials: true
}));

app.options("*", cors()); // allow preflight for all routes

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', checkoutRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'NiceThings API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

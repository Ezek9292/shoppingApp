import { Product } from '../models/Product.js';
import { uploadFromBuffer } from '../utils/cloudinary.js';

// Sample product data for initialization
const SAMPLE_PRODUCTS = [
  {
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM and SSD',
    price: 999.99,
    image: 'https://via.placeholder.com/200?text=Laptop',
    stock: 50
  },
  {
    name: 'Mouse',
    description: 'Wireless ergonomic mouse',
    price: 29.99,
    image: 'https://via.placeholder.com/200?text=Mouse',
    stock: 200
  },
  {
    name: 'Keyboard',
    description: 'Mechanical gaming keyboard with RGB',
    price: 79.99,
    image: 'https://via.placeholder.com/200?text=Keyboard',
    stock: 150
  },
  {
    name: 'Monitor',
    description: '27" 4K UHD Monitor',
    price: 399.99,
    image: 'https://via.placeholder.com/200?text=Monitor',
    stock: 75
  },
  {
    name: 'Headphones',
    description: 'Active noise-cancelling headphones',
    price: 199.99,
    image: 'https://via.placeholder.com/200?text=Headphones',
    stock: 100
  },
  {
    name: 'Webcam',
    description: '1080p HD webcam',
    price: 89.99,
    image: 'https://via.placeholder.com/200?text=Webcam',
    stock: 120
  }
];

// Initialize products (run once)
export const initializeProducts = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(SAMPLE_PRODUCTS);
      console.log('Sample products initialized');
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Upload product image (accepts base64/data URL or raw base64) and attach to product
export const uploadProductImage = async (req, res) => {
  try {
    const { image, productId } = req.body; // image can be a data URL or base64
    if (!image) return res.status(400).json({ error: 'Image data is required' });

    // Normalize base64/data URL to buffer
    let base64Data = image;
    const dataUrlMatch = /^data:(.+);base64,(.+)$/.exec(image);
    if (dataUrlMatch) {
      base64Data = dataUrlMatch[2];
    }

    const buffer = Buffer.from(base64Data, 'base64');

    const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });

    // If productId provided, update product record
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      product.image = result.secure_url;
      product.imageId = result.public_id;
      await product.save();
      return res.json({ success: true, product });
    }

    res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error('Upload product image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};


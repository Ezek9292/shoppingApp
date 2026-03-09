import { Product } from '../models/Product.js';
import cloudinary from '../utils/cloudinary.js';
import { uploadFromBuffer } from '../utils/cloudinary.js';
import {
  DEFAULT_PRODUCT_CATEGORY,
  PRODUCT_CATEGORIES,
  normalizeCategory
} from '../constants/productCategories.js';
import { normalizeColors, normalizeSizes } from '../constants/productVariants.js';

// Seed defaults for first-time database setup.
const SAMPLE_PRODUCTS = [
  {
    name: 'Urban Runner Sneakers',
    description: 'Lightweight everyday sneakers for city comfort.',
    category: 'Footware',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'White'],
    price: 199.99,
    image: 'https://via.placeholder.com/200?text=Footware',
    stock: 50
  },
  {
    name: 'Cotton Casual Shirt',
    description: 'Breathable men and women unisex casual shirt.',
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'White', 'Gray'],
    price: 89.99,
    image: 'https://via.placeholder.com/200?text=Clothing',
    stock: 200
  },
  {
    name: 'Glow Pro Makeup Kit',
    description: 'Complete cosmetics set for daily and event looks.',
    category: 'Cosmetics',
    sizes: ['One Size'],
    colors: ['Pink', 'Gold'],
    price: 129.99,
    image: 'https://via.placeholder.com/200?text=Cosmetics',
    stock: 150
  },
  {
    name: 'Classic Leather Watch',
    description: 'Elegant watch with premium leather strap.',
    category: 'Watches',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Silver'],
    price: 399.99,
    image: 'https://via.placeholder.com/200?text=Watches',
    stock: 75
  },
  {
    name: 'Signature Tote Bag',
    description: 'Spacious handbag for work, travel, and lifestyle.',
    category: 'Bags',
    sizes: ['One Size'],
    colors: ['Brown', 'Black', 'Beige'],
    price: 179.99,
    image: 'https://via.placeholder.com/200?text=Bags',
    stock: 100
  },
  {
    name: 'Silver Chain Accessory Set',
    description: 'Accessories bundle with chain, bracelet, and rings.',
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Silver', 'Gold'],
    price: 69.99,
    image: 'https://via.placeholder.com/200?text=Accessories',
    stock: 120
  }
];

export const initializeProducts = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) return;

    await Product.insertMany(SAMPLE_PRODUCTS);
    console.log('Sample products initialized');
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { q = '', category = '' } = req.query;
    const filter = {};

    if (category && PRODUCT_CATEGORIES.some((item) => item.toLowerCase() === String(category).toLowerCase())) {
      filter.category = normalizeCategory(category);
    }

    if (q && String(q).trim()) {
      const escaped = String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    const normalizedProducts = products.map((product) => {
      const base = product.toObject();
      return {
        ...base,
        category: product.category || DEFAULT_PRODUCT_CATEGORY,
        sizes: normalizeSizes(base.sizes),
        colors: normalizeColors(base.colors)
      };
    });
    res.json(normalizedProducts);
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
    const base = product.toObject();
    res.json({
      ...base,
      category: product.category || DEFAULT_PRODUCT_CATEGORY,
      sizes: normalizeSizes(base.sizes),
      colors: normalizeColors(base.colors)
    });
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
      
      // Clean up old image
      if (product.imageId) {
        try { await cloudinary.uploader.destroy(product.imageId); } catch (e) { console.error('Cloudinary delete error', e); }
      }

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

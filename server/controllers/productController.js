import { Product } from '../models/Product.js';
import cloudinary from '../utils/cloudinary.js';
import { uploadFromBuffer } from '../utils/cloudinary.js';

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

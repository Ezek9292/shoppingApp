import { Product } from '../models/Product.js';
import cloudinary from '../utils/cloudinary.js';
import { uploadFromBuffer } from '../utils/cloudinary.js';

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({ error: 'Failed to list products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image, images } = req.body;
    if (!name || !description || price == null) return res.status(400).json({ error: 'Missing fields' });

    const product = new Product({ name, description, price, stock: stock || 0 });

    // Handle primary image
    if (image) {
      let base64Data = image;
      const dataUrlMatch = /^data:(.+);base64,(.+)$/.exec(image);
      if (dataUrlMatch) base64Data = dataUrlMatch[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });
      product.image = result.secure_url;
      product.imageId = result.public_id;
    }

    // Handle multiple images
    if (images && Array.isArray(images) && images.length > 0) {
      product.images = [];
      for (const img of images) {
        if (!img) continue;
        let base64Data = img;
        const dataUrlMatch = /^data:(.+);base64,(.+)$/.exec(img);
        if (dataUrlMatch) base64Data = dataUrlMatch[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });
        product.images.push({ url: result.secure_url, imageId: result.public_id });
      }
    }

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image, images } = req.body;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (name) product.name = name;
    if (description) product.description = description;
    if (price != null) product.price = price;
    if (stock != null) product.stock = stock;

    // Handle primary image update
    if (image) {
      let base64Data = image;
      const dataUrlMatch = /^data:(.+);base64,(.+)$/.exec(image);
      if (dataUrlMatch) base64Data = dataUrlMatch[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });
      if (product.imageId) {
        try { await cloudinary.uploader.destroy(product.imageId); } catch (e) { /* ignore */ }
      }
      product.image = result.secure_url;
      product.imageId = result.public_id;
    }

    // Handle multiple images update
    if (images !== undefined) {
      // Delete old images
      if (product.images && product.images.length > 0) {
        for (const img of product.images) {
          if (img.imageId) {
            try { await cloudinary.uploader.destroy(img.imageId); } catch (e) { /* ignore */ }
          }
        }
      }
      // Upload new images
      product.images = [];
      if (Array.isArray(images) && images.length > 0) {
        for (const img of images) {
          if (!img || typeof img === 'string' && !img.includes('base64')) continue; // skip URLs from gallery
          if (typeof img === 'string' && img.includes('https')) {
            product.images.push({ url: img, imageId: null });
            continue;
          }
          let base64Data = img;
          const dataUrlMatch = /^data:(.+);base64,(.+)$/.exec(img);
          if (dataUrlMatch) base64Data = dataUrlMatch[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });
          product.images.push({ url: result.secure_url, imageId: result.public_id });
        }
      }
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete primary image
    if (product.imageId) {
      try { await cloudinary.uploader.destroy(product.imageId); } catch (e) { /* ignore */ }
    }

    // Delete gallery images
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.imageId) {
          try { await cloudinary.uploader.destroy(img.imageId); } catch (e) { /* ignore */ }
        }
      }
    }

    await product.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

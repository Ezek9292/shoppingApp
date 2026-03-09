import { Product } from '../models/Product.js';
import cloudinary from '../utils/cloudinary.js';
import { uploadFromBuffer } from '../utils/cloudinary.js';
import { DEFAULT_PRODUCT_CATEGORY, normalizeCategory } from '../constants/productCategories.js';
import { normalizeColors, normalizeSizes } from '../constants/productVariants.js';

const MAX_IMAGE_SIZE_BYTES = 1024 * 1024; // 1MB

const bufferFromBase64Image = (image) => {
  let base64Data = image;
  const dataUrlMatch = /^data:(.+);base64,(.+)$/.exec(image);
  if (dataUrlMatch) base64Data = dataUrlMatch[2];

  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image must be 1MB or less');
  }

  return buffer;
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
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
    console.error('List products error:', error);
    res.status(500).json({ error: 'Failed to list products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, sizes, colors, image, images } = req.body;
    if (!name || !description || price == null) return res.status(400).json({ error: 'Missing fields' });

    const product = new Product({
      name,
      description,
      price,
      stock: stock || 0,
      category: normalizeCategory(category),
      sizes: normalizeSizes(sizes),
      colors: normalizeColors(colors)
    });

    // Handle primary image
    if (image) {
      const buffer = bufferFromBase64Image(image);
      const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });
      product.image = result.secure_url;
      product.imageId = result.public_id;
    }

    // Handle multiple images
    if (images && Array.isArray(images) && images.length > 0) {
      product.images = [];
      for (const img of images) {
        if (!img) continue;
        const buffer = bufferFromBase64Image(img);
        const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });
        product.images.push({ url: result.secure_url, imageId: result.public_id });
      }
    }

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    if (error.message === 'Image must be 1MB or less') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, sizes, colors, image, images } = req.body;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (name) product.name = name;
    if (description) product.description = description;
    if (price != null) product.price = price;
    if (stock != null) product.stock = stock;
    if (category) product.category = normalizeCategory(category);
    if (sizes !== undefined) product.sizes = normalizeSizes(sizes);
    if (colors !== undefined) product.colors = normalizeColors(colors);

    // Handle primary image update
    if (image) {
      const buffer = bufferFromBase64Image(image);
      const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });
      if (product.imageId) {
        try { await cloudinary.uploader.destroy(product.imageId); } catch (e) { /* ignore */ }
      }
      product.image = result.secure_url;
      product.imageId = result.public_id;
    }

    // Handle multiple images update
    if (images !== undefined) {
      const currentImages = product.images || [];
      // Identify images to keep (URLs passed in body)
      const imagesToKeep = images.filter(img => typeof img === 'string' && img.startsWith('http'));
      
      // Delete removed images from Cloudinary
      const imagesToDelete = currentImages.filter(dbImg => !imagesToKeep.includes(dbImg.url));
      for (const img of imagesToDelete) {
        if (img.imageId) {
          try { await cloudinary.uploader.destroy(img.imageId); } catch (e) { console.error('Cloudinary delete error', e); }
        }
      }

      // Rebuild images array
      const updatedImages = [];
      if (Array.isArray(images) && images.length > 0) {
        for (const img of images) {
          if (!img) continue;
          
          // Preserve existing images
          if (typeof img === 'string' && img.startsWith('http')) {
            const existing = currentImages.find(dbImg => dbImg.url === img);
            updatedImages.push(existing || { url: img, imageId: null });
            continue;
          }

          const buffer = bufferFromBase64Image(img);
          const result = await uploadFromBuffer(buffer, { folder: 'shopping_app/products' });
          updatedImages.push({ url: result.secure_url, imageId: result.public_id });
        }
      }
      product.images = updatedImages;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    if (error.message === 'Image must be 1MB or less') {
      return res.status(400).json({ error: error.message });
    }
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

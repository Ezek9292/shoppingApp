import mongoose from 'mongoose';
import { DEFAULT_PRODUCT_CATEGORY, PRODUCT_CATEGORIES } from '../constants/productCategories.js';
import { PRODUCT_COLORS, PRODUCT_SIZES } from '../constants/productVariants.js';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      default: DEFAULT_PRODUCT_CATEGORY
    },
    image: {
      type: String,
      default: null
    },
    imageId: {
      type: String,
      default: null
    },
    images: [
      {
        url: String,
        imageId: String
      }
    ],
    stock: {
      type: Number,
      default: 100
    },
    sizes: [
      {
        type: String,
        enum: PRODUCT_SIZES
      }
    ],
    colors: [
      {
        type: String,
        enum: PRODUCT_COLORS
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.sizes = Array.isArray(ret.sizes) ? ret.sizes : [];
        ret.colors = Array.isArray(ret.colors) ? ret.colors : [];
        return ret;
      }
    }
  }
);

export const Product = mongoose.model('Product', productSchema);

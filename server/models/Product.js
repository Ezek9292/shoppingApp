import mongoose from 'mongoose';

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
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);

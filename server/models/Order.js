import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'completed'
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paystack-mobile-money', 'paystack'],
      default: 'paystack'
    },
    paymentReference: {
      type: String,
      default: null
    },
    cardLast4: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);

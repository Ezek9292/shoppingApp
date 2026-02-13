import { Order } from '../models/Order.js';
import axios from 'axios';

const PAYSTACK_API = 'https://api.paystack.co';

const validateOrderData = ({ firstName, lastName, email, address }) => {
  if (!firstName || !lastName || !email || !address) {
    return { valid: false, error: 'Missing required fields' };
  }
  return { valid: true };
};

// Initialize Paystack payment for mobile money (Ghana)
export const initializePayment = async (req, res) => {
  try {
    const { firstName, lastName, email, address, items, total } = req.body;
    const userId = req.userId;

    // Validate data
    const validation = validateOrderData({ firstName, lastName, email, address });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Create temporary order
    const order = new Order({
      userId,
      firstName,
      lastName,
      email,
      address,
      items,
      total,
      status: 'pending',
      paymentMethod: 'paystack'
    });
    await order.save();

    // Initialize Paystack payment
    const paystackConfig = {
      email: email,
      amount: Math.round(total * 100), // Paystack uses kobo (cents)
      metadata: {
        orderId: order._id.toString(),
        firstName,
        lastName,
        address,
        items: items.map(item => ({
          id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      }
    };

    const response = await axios.post(`${PAYSTACK_API}/transaction/initialize`, paystackConfig, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference,
      orderId: order._id
    });
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
};

// Verify Paystack payment
export const verifyPayment = async (req, res) => {
  try {
    const { reference, orderId } = req.body;

    if (!reference) {
      return res.status(400).json({ error: 'Payment reference is required' });
    }

    // Verify with Paystack
    const response = await axios.get(`${PAYSTACK_API}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const paymentData = response.data.data;

    if (paymentData.status === 'success') {
      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        status: 'completed',
        paymentReference: reference,
        paymentMethod: 'paystack-mobile-money'
      });

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: orderId,
        amount: paymentData.amount / 100 // Convert from kobo to GHS
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

// Legacy checkout (card payment - kept for backward compatibility)
export const checkout = async (req, res) => {
  try {
    const { firstName, lastName, email, address, cardNumber, expiryDate, cvv, items, total } = req.body;
    const userId = req.userId;

    // Validate data
    const validation = validateOrderData({ firstName, lastName, email, address });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Create order object with user association
    const order = new Order({
      userId,
      firstName,
      lastName,
      email,
      address,
      items,
      total,
      status: 'completed',
      paymentMethod: 'card',
      cardLast4: cardNumber.slice(-4)
    });

    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      orderId: order._id,
      total
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};

// Get all orders for authenticated user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const userOrders = await Order.find({ userId });
    res.json(userOrders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get all orders (admin endpoint)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get order by ID
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};


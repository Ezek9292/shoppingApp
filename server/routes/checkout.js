import express from 'express';
import { checkout, getUserOrders, getOrders, getOrder, initializePayment, verifyPayment } from '../controllers/checkoutController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', verifyToken, checkout);
router.post('/payment/initialize', verifyToken, initializePayment);
router.post('/payment/verify', verifyToken, verifyPayment);
router.get('/user-orders', verifyToken, getUserOrders);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);

export default router;

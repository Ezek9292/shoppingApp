import express from 'express';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/products', verifyToken, requireAdmin, listProducts);
router.post('/products', verifyToken, requireAdmin, createProduct);
router.put('/products/:id', verifyToken, requireAdmin, updateProduct);
router.delete('/products/:id', verifyToken, requireAdmin, deleteProduct);

export default router;

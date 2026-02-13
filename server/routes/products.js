import express from 'express';
import { getAllProducts, getProductById, uploadProductImage } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/upload', uploadProductImage);

export default router;

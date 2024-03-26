import express, { NextFunction, Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controller/product/productionController';
import {
  authMiddleware,
  protectProductRoute,
} from '../middleware/authMiddleware';

const router: Router = express.Router();
router.get('/', getAllProducts);
router.get('/:productId', getProductById);

router.use([authMiddleware, protectProductRoute]);

router.post('/', createProduct);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);
router.put('/:productId/status', deleteProduct);

export default router;

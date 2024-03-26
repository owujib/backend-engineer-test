import express, { Router } from 'express';
import {
  addToCart,
  getUserCart,
  loginUser,
  registerUser,
} from '../controller/user/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.use(authMiddleware);

router.get('/cart', getUserCart);
router.post('/add-to-cart', addToCart);

export default router;

import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import productRoutes from './product.js';
import categoryRoutes from './category.js';
import orderRoutes from './order.js';
import checkoutRoutes from './checkout.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/', checkoutRoutes);

export default router;

import express from 'express';
import { getAllOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/orderController.js';
import { getOrdersByUser } from '../controllers/orderUserController.js';
import { authenticate } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/', authenticate, isAdmin, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, createOrder);
router.put('/:id/status', authenticate, updateOrderStatus);
router.get('/user/:id', authenticate, getOrdersByUser);

export default router;

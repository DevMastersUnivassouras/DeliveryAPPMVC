import express from 'express';
import { Order } from '../models/Order.js';
import { OrderItem } from '../models/OrderItem.js';

const router = express.Router();

router.post('/checkout-simulate', async (req, res) => {
  try {
    const { items, address, customer } = req.body;
    if (!items || !address || !customer) {
      return res.status(400).json({ error: 'Dados incompletos para o pedido' });
    }
    // Converte userId para inteiro
    const userId = parseInt(customer.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuário inválido' });
    }
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 3.99;
    // Verifica se usuário existe
    const user = await import('../models/User.js').then(m => m.User.findByPk(userId));
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    // Verifica se todos os produtos existem
    for (const item of items) {
      const product = await import('../models/Product.js').then(m => m.Product.findByPk(item.product.id));
      if (!product) {
        return res.status(404).json({ error: `Produto não encontrado: ID ${item.product.id}` });
      }
    }
    const order = await Order.create({
      userId,
      address,
      total,
      status: 'processing'
    });
    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      });
    }
    res.status(201).json({ orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar pedido', details: err.message });
  }
});

export default router;

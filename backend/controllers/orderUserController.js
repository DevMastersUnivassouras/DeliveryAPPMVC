import { Order } from '../models/Order.js';
import { OrderItem } from '../models/OrderItem.js';

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Permite apenas o próprio usuário ou admin acessar
    if (parseInt(userId) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const orders = await Order.findAll({
      where: { userId },
      include: [OrderItem]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

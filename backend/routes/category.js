import express from 'express';
import { getAllCategories, createCategory } from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', authenticate, createCategory);
router.post('/seed-categories', async (req, res) => {
  try {
    const categories = [
      { name: 'Bebidas', description: 'Bebidas refrescantes para qualquer ocasião' },
      { name: 'Hambúrgueres', description: 'Hambúrgueres deliciosos para amassar' },
      { name: 'Pizzas', description: 'Pizzas autênticas com ingredientes frescos' },
      { name: 'Sobremesas', description: 'Doces para completar sua refeição' }
    ];
    const created = [];
    for (const cat of categories) {
      const c = await import('../models/Category.js').then(m => m.Category.create(cat));
      created.push(c);
    }
    res.json({ ok: true, created });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao popular categorias', details: err.message });
  }
});

export default router;

import { Category } from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log('Tentando criar categoria:', name, description);
    const category = await Category.create({ name, description });
    console.log('Categoria criada:', category);
    res.status(201).json(category);
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
};

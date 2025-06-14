import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);
router.post('/seed-products', async (req, res) => {
  try {
    const products = [
      { id: '101', name: 'Refrigerante Cola', description: 'Refrigerante refrescante com um toque de baunilha', price: 4.99, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97', categoryName: 'Bebidas' },
      { id: '102', name: 'Limonada Caseira', description: 'Limonada caseira com limões reais e um toque de hortelã', price: 5.99, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859', categoryName: 'Bebidas' },
      { id: '103', name: 'Chá Gelado', description: 'Chá recém-preparado servido com gelo e limão', price: 4.50, image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87', categoryName: 'Bebidas' },
      { id: '201', name: 'Hambúrguer Clássico', description: 'Hambúrguer suculento com alface, tomate e nosso molho especial', price: 12.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', categoryName: 'Hambúrgueres' },
      { id: '202', name: 'Hambúrguer do Amante de Queijo', description: 'Queijo duplo com nosso hambúrguer exclusivo e cebolas caramelizadas', price: 14.99, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b', categoryName: 'Hambúrgueres' },
      { id: '203', name: 'Hambúrguer Vegetariano', description: 'Hambúrguer à base de plantas com vegetais frescos e maionese vegana', price: 13.50, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360', categoryName: 'Hambúrgueres' },
      { id: '301', name: 'Pizza Margherita', description: 'Pizza clássica com molho de tomate, mussarela e manjericão fresco', price: 16.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002', categoryName: 'Pizzas' },
      { id: '302', name: 'Pizza de Pepperoni', description: 'Pepperoni picante com queijo derretido e molho de tomate', price: 18.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e', categoryName: 'Pizzas' },
      { id: '303', name: 'Pizza Vegetariana', description: 'Vegetais frescos sortidos em uma massa fina com molho de tomate', price: 17.50, image: 'https://plus.unsplash.com/premium_photo-1690056321981-dfe9e75e0247?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', categoryName: 'Pizzas' },
      { id: '401', name: 'Brownie de Chocolate', description: 'Brownie de chocolate rico com uma bola de sorvete de baunilha', price: 8.99, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e', categoryName: 'Sobremesas' },
      { id: '402', name: 'Cheesecake de Nova York', description: 'Cheesecake cremoso estilo Nova York com compota de frutas vermelhas', price: 9.99, image: 'https://images.unsplash.com/photo-1578775887804-699de7086ff9?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', categoryName: 'Sobremesas' },
      { id: '403', name: 'Torta de Maçã', description: 'Torta de maçã caseira servida com creme batido', price: 7.50, image: 'https://plus.unsplash.com/premium_photo-1729731478134-575973b752da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', categoryName: 'Sobremesas' }
    ];
    const Category = (await import('../models/Category.js')).Category;
    const Product = (await import('../models/Product.js')).Product;
    const catList = await Category.findAll();
    const created = [];
    for (const prod of products) {
      const cat = catList.find(c => c.name === prod.categoryName);
      if (!cat) continue;
      const p = await Product.create({
        id: prod.id, // força o id igual ao mockData
        name: prod.name,
        description: prod.description,
        price: prod.price,
        image: prod.image,
        categoryId: cat.id
      });
      created.push(p);
    }
    res.json({ ok: true, created });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao popular produtos', details: err.message });
  }
});

export default router;

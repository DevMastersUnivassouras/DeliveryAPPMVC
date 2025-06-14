import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configuração do CORS para múltiplas origens
const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:8080', // Sua porta alternativa
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origem (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = 'A política de CORS não permite acesso a partir desta origem';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Adicionar middleware para lidar com preflight requests
app.options('*', cors());

app.use(express.json());

// Simulação de banco de dados em memória
let orders = [];

// Middleware de log para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rota para simular checkout
app.post('/api/checkout-simulate', async (req, res) => {
  try {
    const { items, address, customer } = req.body;
    
    if (!items || !address || !customer) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Calcular o total
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + 3.99;

    // Criar um pedido simulado
    const newOrder = {
      id: `order_${Date.now()}`,
      orderId: `ORD-${Date.now().toString().substring(5)}`,
      items: items.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price
        },
        quantity: item.quantity
      })),
      total: total,
      status: 'processing',
      address: address,
      paymentStatus: 'paid',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Adicionar ao "banco de dados"
    orders.push(newOrder);

    // Retornar o pedido criado
    res.status(201).json({
      success: true,
      orderId: newOrder.id,
      paymentStatus: 'paid',
      order: newOrder
    });
  } catch (error) {
    console.error('Erro no checkout simulado:', error);
    res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: error.message 
    });
  }
});

// Rota para obter pedido
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Pedido não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// Rota para cancelar pedido
app.post('/api/orders/:id/cancel', (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'cancelled';
      orders[orderIndex].updatedAt = new Date().toISOString();
      res.json({ 
        success: true,
        order: orders[orderIndex]
      });
    } else {
      res.status(404).json({ error: 'Pedido não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cancelar pedido' });
  }
});

// Rota para listar pedidos do usuário
app.get('/api/orders/user/:userId', (req, res) => {
  try {
    const userOrders = orders.filter(o => 
      o.customer.id === req.params.userId && 
      o.status !== 'cancelled'
    );
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
});

// Rota para atualizar status do pedido
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório' });
    }

    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Validar o status
    const validStatuses = ['processing', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    res.json({ 
      success: true,
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
});

// Rota para listar todos os pedidos (admin)
app.get('/api/orders', (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    ordersCount: orders.length
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro global:', err);
  res.status(500).json({ 
    error: 'Erro interno no servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Origens permitidas: ${allowedOrigins.join(', ')}`);
});
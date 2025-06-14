# DeliveryAPP

Sistema completo de delivery com frontend React + Vite + TypeScript e backend Node.js + Express + Sequelize + SQLite.

## Funcionalidades
- Cadastro e login de usuários com autenticação JWT
- Painel administrativo protegido (admin@example.com / admin123)
- Catálogo de produtos e categorias
- Carrinho individual por usuário
- Pedidos individualizados por usuário
- Listagem de "Meus Pedidos" e painel admin com todos os pedidos
- Atualização de status do pedido pelo admin
- Banco de dados SQLite com seed automático
- Padrão MVC no backend

## Instalação

### 1. Clone o repositório
```bash
# Clone o projeto
https://github.com/seu-usuario/DeliveryAPP.git
cd DeliveryAPP-Pronto-main
```

### 2. Instale as dependências
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd ../
npm install
```

### 3. Popule o banco de dados
No diretório `backend`:
```bash
node seed.js
```
Isso criará o admin, categorias e produtos no banco.

### 4. Rode o backend
```bash
npm start
# ou
node server.js
```
O backend ficará disponível em `http://localhost:5000`

### 5. Rode o frontend
```bash
npm run dev
```
O frontend ficará disponível em `http://localhost:8080`

## Credenciais de acesso admin
- **Email:** admin@example.com
- **Senha:** admin123

## Endpoints principais (backend)
- `POST /api/auth/register` — Cadastro de usuário
- `POST /api/auth/login` — Login de usuário/admin
- `GET /api/products` — Listar produtos
- `GET /api/categories` — Listar categorias
- `POST /api/orders` — Criar pedido
- `GET /api/orders/user/:id` — Listar pedidos do usuário autenticado
- `GET /api/orders` — Listar todos os pedidos (admin)
- `PUT /api/orders/:id/status` — Atualizar status do pedido (admin)

## Observações
- O backend utiliza autenticação JWT em todas as rotas protegidas.
- O painel admin só é acessível para usuários com role `admin`.
- O seed garante que o admin e os dados de catálogo estejam sempre presentes.



# DeliveryAPP Backend

## Como rodar o backend

1. Acesse a pasta backend:
   ```sh
   cd backend
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Crie o arquivo `.env` (já incluso):
   ```env
   JWT_SECRET=secret
   PORT=5000
   ```
4. Inicie o servidor:
   ```sh
   npm run dev
   ```

O backend estará rodando em http://localhost:5000

## Estrutura de pastas
- `controllers/` — Lógica das rotas
- `models/` — Modelos do banco de dados (Sequelize)
- `routes/` — Rotas da API
- `database/` — Configuração do banco SQLite
- `middlewares/` — Middlewares (ex: autenticação)
- `utils/` — Funções utilitárias

## Integração com o frontend
- O frontend pode consumir a API REST em `/api` (ex: `/api/products`, `/api/orders`)
- Para autenticação, use o token JWT retornado no login

## Banco de dados
- O banco SQLite será criado automaticamente na pasta `backend/database` ao rodar o servidor.

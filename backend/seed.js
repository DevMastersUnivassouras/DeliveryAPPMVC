import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { User } from './models/User.js';

const dataPath = path.resolve('./seedData.json');
const backendUrl = 'http://localhost:5000/api';

async function getToken() {
  // Ajuste para o usuário admin cadastrado no backend
  const res = await fetch(`${backendUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
  });
  const data = await res.json();
  return data.token;
}

async function seedAdmin() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const adminName = 'Administrador';
  const existing = await User.findOne({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await User.create({ name: adminName, email: adminEmail, password: hash, role: 'admin' });
    console.log('Admin user created!');
  } else {
    console.log('Admin user already exists.');
  }
}

async function seed() {
  const { categories, products } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const token = await getToken();

  // Cadastra categorias e salva os dados reais
  const createdCategories = [];
  for (const cat of categories) {
    const res = await fetch(`${backendUrl}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: cat.name, description: cat.description })
    });
    const data = await res.json();
    createdCategories.push(data.id || data.category?.id);
  }

  // Busca categorias reais do backend para garantir os IDs corretos
  const catRes = await fetch(`${backendUrl}/categories`);
  const catList = await catRes.json();

  // Cadastra produtos usando o nome da categoria para mapear o ID correto
  for (const prod of products) {
    const catName = categories[prod.categoryIndex].name;
    const realCat = catList.find(c => c.name === catName);
    if (!realCat) {
      console.error('Categoria não encontrada para produto:', prod.name);
      continue;
    }
    await fetch(`${backendUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        image: prod.image,
        categoryId: realCat.id
      })
    });
  }
  console.log('Categorias e produtos cadastrados!');
}

seedAdmin().then(() => seed()).catch(console.error);

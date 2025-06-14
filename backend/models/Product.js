import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import { Category } from './Category.js';

export class Product extends Model {}

Product.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.STRING },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'categories', key: 'id' } }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });

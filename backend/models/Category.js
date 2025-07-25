import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/sequelize.js';

export class Category extends Model {}

Category.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'categories',
  timestamps: true
});

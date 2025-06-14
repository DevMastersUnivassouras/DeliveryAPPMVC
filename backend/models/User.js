import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/sequelize.js';

export class User extends Model {}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'customer' }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true
});

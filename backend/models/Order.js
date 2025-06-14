import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import { User } from './User.js';

export class Order extends Model {}

Order.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  total: { type: DataTypes.FLOAT, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true
});

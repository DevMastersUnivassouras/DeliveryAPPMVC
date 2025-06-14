import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/sequelize.js';

export class OrderItem extends Model {}

OrderItem.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' } },
  productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false }
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items',
  timestamps: true
});

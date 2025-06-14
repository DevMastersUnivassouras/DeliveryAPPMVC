import { Order } from './Order.js';
import { OrderItem } from './OrderItem.js';
import { Product } from './Product.js';
import { User } from './User.js';

Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

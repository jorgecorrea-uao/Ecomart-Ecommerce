const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cart = require('./cart.model');
const Product = require('./product.model');

const CartItem = sequelize.define('CartItem', {
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

module.exports = CartItem;

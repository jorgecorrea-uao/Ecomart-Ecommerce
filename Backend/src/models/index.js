const sequelize = require('../config/db')
const User = require('./user.model')
const Product = require('./product.model')
const Category = require('./category.model')
const Cart = require('./cart.model')
const CartItem = require('./cartItem.model')

const models = {
    User,
    Product,
    Category,
    Cart,
    CartItem,
}

// Associations
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' })
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' })
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' })

Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' })
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' })

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' })
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })

module.exports = {
    sequelize,
    ...models,
}


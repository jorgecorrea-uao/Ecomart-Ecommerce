const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Cart = sequelize.define('Cart', {
    status: {
        type: DataTypes.ENUM('active', 'completed'),
        allowNull: false,
        defaultValue: 'active',
    }
})

module.exports = Cart

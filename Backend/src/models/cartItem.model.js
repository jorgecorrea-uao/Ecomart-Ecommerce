const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const CartItem = sequelize.define('CartItem', {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
        }
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
})

module.exports = CartItem

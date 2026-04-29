const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Product = sequelize.define('Product', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})

module.exports = Product

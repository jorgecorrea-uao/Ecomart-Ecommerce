const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Category = sequelize.define('Category', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
})

module.exports = Category

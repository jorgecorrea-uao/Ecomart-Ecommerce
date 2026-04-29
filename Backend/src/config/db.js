const { Sequelize } = require('sequelize')
require('dotenv').config()

const requiredVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST']
const missingVars = requiredVars.filter((key) => !process.env[key])

if (missingVars.length) {
    throw new Error(`Faltan variables de entorno en la configuración DB: ${missingVars.join(', ')}`)
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
)

module.exports = sequelize
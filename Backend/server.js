require('dotenv').config()

const app = require('./src/app')
const { sequelize } = require('./src/models')

const PORT = process.env.PORT || 3000

const validateEnvironment = () => {
    const requiredVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'JWT_SECRET']
    const missing = requiredVars.filter((key) => !process.env[key])

    if (missing.length) {
        console.error(`Faltan variables de entorno: ${missing.join(', ')}`)
        process.exit(1)
    }
}

const startServer = async () => {
    validateEnvironment()

    try {
        await sequelize.authenticate()
        console.log('Conexion exitosa con la base de datos')

        await sequelize.sync({ force: false })
        console.log('Tablas sincronizadas')

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Error al iniciar el servidor', error)
        process.exit(1)
    }
}

startServer()
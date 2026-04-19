require('dotenv').config()

const app = require('./src/app')
const sequelize = require('./src/config/db')

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        await sequelize.authenticate()
        console.log("Conexion exitosa con la base de datos")

        await sequelize.sync({ force:false})
        console.log("Tablas sincronizadas")

        app.listen(PORT, () => {
            console.log("Servidor corriendo en http://localhost:${PORT}")
        })
    } catch(error) {
        console.log("Error al iniciar el servidor", error.message)
        process.exit(1)
    }
}

startServer()
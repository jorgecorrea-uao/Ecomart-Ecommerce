const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Ecomart API corriendo correctamente' })
})

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Ecomart API corriendo correctamente' })
})

app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint no encontrado' })
})

app.use(errorMiddleware)

module.exports = app
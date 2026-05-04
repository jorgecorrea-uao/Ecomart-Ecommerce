const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');
const app = express();

app.disable('x-powered-by');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

sequelize.sync({ alter: true })
  .then(() => console.log('Base de datos sincronizada'))
  .catch(err => console.error('Error al sincronizar la DB:', err));

module.exports = app;

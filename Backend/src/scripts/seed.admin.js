require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const User = require('../models/user.model');

const BCRYPT_ROUNDS = 12;

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOMBRE } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NOMBRE) {
    console.error('Faltan variables de entorno: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOMBRE');
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log(`El usuario ${ADMIN_EMAIL} ya existe con rol: ${existing.role}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);

    const admin = await User.create({
      nombre: ADMIN_NOMBRE,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    });

    console.log(`Admin creado exitosamente: ${admin.email}`);
    process.exit(0);

  } catch (error) {
    console.error('Error al crear el admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();

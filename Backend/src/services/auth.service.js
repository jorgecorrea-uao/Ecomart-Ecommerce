const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const userRepository = require('../repositories/user.repository');

const BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

const authService = {

  async register(nombre, email, password) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await userRepository.save({
      nombre,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    return { id: user.id, nombre: user.nombre, email: user.email };
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Email o contraseña incorrectos');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Email o contraseña incorrectos');

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY, algorithm: 'HS256' }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    await userRepository.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role },
    };
  },

  async refresh(token) {
    const user = await userRepository.findByRefreshToken(token);
    if (!user) throw new Error('Refresh token inválido');

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY, algorithm: 'HS256' }
    );

    return { accessToken };
  },

  async logout(token) {
    const user = await userRepository.findByRefreshToken(token);
    if (!user) throw new Error('Refresh token inválido');

    await userRepository.update(user.id, { refreshToken: null });
  },

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) return;

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await userRepository.update(user.id, { resetPasswordToken, resetPasswordExpires });
  },

  async resetPassword(token, newPassword) {
    const user = await userRepository.findByResetToken(token);
    if (!user) throw new Error('Token de recuperación inválido');

    if (user.resetPasswordExpires < new Date()) {
      throw new Error('El token de recuperación ha expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  },

};

module.exports = authService;
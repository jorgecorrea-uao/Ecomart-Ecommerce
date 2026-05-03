const authService = require('../services/auth.service');

const REGISTER_KNOWN_ERRORS = ['El email ya está registrado'];
const LOGIN_KNOWN_ERRORS = ['Email o contraseña incorrectos'];
const REFRESH_KNOWN_ERRORS = ['Refresh token inválido'];
const RESET_KNOWN_ERRORS = ['Token de recuperación inválido', 'El token de recuperación ha expirado'];

const authController = {

  async register(req, res) {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
      }

      const user = await authService.register(nombre, email.toLowerCase(), password);
      return res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', data: user });

    } catch (error) {
      if (REGISTER_KNOWN_ERRORS.includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios' });
      }

      const result = await authService.login(email.toLowerCase(), password);
      return res.status(200).json({ success: true, message: 'Login exitoso', data: result });

    } catch (error) {
      if (LOGIN_KNOWN_ERRORS.includes(error.message)) {
        return res.status(401).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token requerido' });
      }

      const result = await authService.refresh(refreshToken);
      return res.status(200).json({ success: true, data: result });

    } catch (error) {
      if (REFRESH_KNOWN_ERRORS.includes(error.message)) {
        return res.status(401).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token requerido' });
      }

      await authService.logout(refreshToken);
      return res.status(200).json({ success: true, message: 'Sesión cerrada exitosamente' });

    } catch (error) {
      if (error.message === 'Refresh token inválido') {
        return res.status(401).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email requerido' });
      }

      await authService.forgotPassword(email.toLowerCase());
      return res.status(200).json({
        success: true,
        message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña',
      });

    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ success: false, message: 'Token y nueva contraseña son obligatorios' });
      }

      await authService.resetPassword(token, password);
      return res.status(200).json({ success: true, message: 'Contraseña restablecida exitosamente' });

    } catch (error) {
      if (RESET_KNOWN_ERRORS.includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

};

module.exports = authController;

const authService = require('../services/auth.service')

const authController = {
    async register(req, res) {
        try {
            const { nombre, email, password } = req.body

            if (!nombre || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son obligatorios'
                })
            }

            const user = await authService.register(nombre, email.toLowerCase(), password)
            return res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: user
            })
        } catch (error) {
            console.error('❌ Error en register:', error.message)
            if (error.message === 'el email ya esta registrado') {
                return res.status(400).json({ success: false, message: error.message })
            }
            return res.status(500).json({ success: false, message: 'Error interno del servidor' })
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios' })
            }

            const result = await authService.login(email.toLowerCase(), password)

            return res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: {
                    accessToken: result.token,
                    user: result.user
                }
            })
        } catch (error) {
            console.error('❌ Error en login:', error.message)
            if (error.message === 'Email o contraseña incorrectos') {
                return res.status(400).json({ success: false, message: error.message })
            }
            return res.status(500).json({ success: false, message: 'Error interno del servidor' })
        }
    }
}

module.exports = authController
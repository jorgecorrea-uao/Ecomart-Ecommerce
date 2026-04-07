const authService = require('../services/auth.service')
const userRepository = require('../repositories/user.repository')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

jest.mock('../repositories/user.repository')
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

describe('AuthService', () => {

    beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret-key'
    })

    describe('register', () => {
    it('debe registrar un usuario nuevo exitosamente', async () => {
        userRepository.findByEmail.mockResolvedValue(null)
        bcrypt.hash.mockResolvedValue('hashed_password_123')
        userRepository.save.mockResolvedValue({
        id: 1, nombre: 'Juan', email: 'juan@test.com', password: 'hashed_password_123',
        })

        const result = await authService.register('Juan', 'juan@test.com', 'password123')

        expect(result).toEqual({ id: 1, nombre: 'Juan', email: 'juan@test.com' })
        expect(userRepository.findByEmail).toHaveBeenCalledWith('juan@test.com')
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12)
    })

    it('debe lanzar error si el email ya está registrado', async () => {
        userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'juan@test.com' })

        await expect(authService.register('Juan', 'juan@test.com', 'password123'))
        .rejects.toThrow('El email ya está registrado')

        expect(userRepository.save).not.toHaveBeenCalled()
    });

    it('no debe exponer la contraseña en el resultado', async () => {
        userRepository.findByEmail.mockResolvedValue(null)
        bcrypt.hash.mockResolvedValue('hashed')
        userRepository.save.mockResolvedValue({ id: 2, nombre: 'Ana', email: 'ana@test.com' })

        const result = await authService.register('Ana', 'ana@test.com', 'pass')
        expect(result).not.toHaveProperty('password')
    });

    it('debe guardar la contraseña hasheada (nunca en texto plano)', async () => {
        userRepository.findByEmail.mockResolvedValue(null)
        bcrypt.hash.mockResolvedValue('hashed_pass')
        userRepository.save.mockResolvedValue({ id: 3, nombre: 'Pedro', email: 'pedro@test.com' })

        await authService.register('Pedro', 'pedro@test.com', 'plaintext')

        const saveCall = userRepository.save.mock.calls[0][0]
        expect(saveCall.password).toBe('hashed_pass')
        expect(saveCall.password).not.toBe('plaintext')
    })
    })

    describe('login', () => {
    const mockUser = { id: 1, nombre: 'Juan', email: 'juan@test.com', password: 'hashed_password', role: 'user' }

    it('debe hacer login exitosamente con credenciales correctas', async () => {
        userRepository.findByEmail.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(true)
        jwt.sign.mockReturnValue('mock_access_token')
        userRepository.update.mockResolvedValue(mockUser)

        const result = await authService.login('juan@test.com', 'password123')

        expect(result).toHaveProperty('accessToken', 'mock_access_token')
        expect(result).toHaveProperty('refreshToken')
        expect(result.user).toEqual({ id: 1, nombre: 'Juan', email: 'juan@test.com', role: 'user' })
    })

    it('debe lanzar error si el email no existe', async () => {
        userRepository.findByEmail.mockResolvedValue(null)

        await expect(authService.login('noexiste@test.com', 'password'))
        .rejects.toThrow('Email o contraseña incorrectos')
    })

    it('debe lanzar error si la contraseña es incorrecta', async () => {
        userRepository.findByEmail.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(false)

        await expect(authService.login('juan@test.com', 'wrongpass'))
        .rejects.toThrow('Email o contraseña incorrectos')
    })

    it('debe guardar el refreshToken en la base de datos', async () => {
        userRepository.findByEmail.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(true)
        jwt.sign.mockReturnValue('access_token')
        userRepository.update.mockResolvedValue(mockUser)

        await authService.login('juan@test.com', 'password123')

        expect(userRepository.update).toHaveBeenCalledWith(1,
        expect.objectContaining({ refreshToken: expect.any(String) })
        )
    })
    it('el mensaje de error debe ser idéntico para email inexistente y contraseña incorrecta', async () => {
        userRepository.findByEmail.mockResolvedValue(null)
        let error1
        try { await authService.login('noexiste@test.com', 'pass'); } catch (e) { error1 = e.message; }

        userRepository.findByEmail.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(false)
        let error2
        try { await authService.login('juan@test.com', 'wrong'); } catch (e) { error2 = e.message; }

        expect(error1).toBe(error2)
    })
    })

    describe('refresh', () => {
    it('debe generar un nuevo accessToken con refreshToken válido', async () => {
        const mockUser = { id: 1, email: 'juan@test.com', role: 'user' }
        userRepository.findByRefreshToken.mockResolvedValue(mockUser)
        jwt.sign.mockReturnValue('new_access_token')

        const result = await authService.refresh('valid_refresh_token')

        expect(result).toHaveProperty('accessToken', 'new_access_token')
    })

    it('debe lanzar error con refreshToken inválido', async () => {
        userRepository.findByRefreshToken.mockResolvedValue(null)

        await expect(authService.refresh('invalid_token'))
        .rejects.toThrow('Refresh token inválido')
    })
    })

    describe('logout', () => {
    it('debe cerrar sesión y limpiar el refreshToken', async () => {
        const mockUser = { id: 1 };
        userRepository.findByRefreshToken.mockResolvedValue(mockUser)
        userRepository.update.mockResolvedValue(mockUser)
        await authService.logout('valid_refresh_token')

        expect(userRepository.update).toHaveBeenCalledWith(1, { refreshToken: null })
    })

    it('debe lanzar error si el refreshToken no existe', async () => {
        userRepository.findByRefreshToken.mockResolvedValue(null)

        await expect(authService.logout('bad_token'))
        .rejects.toThrow('Refresh token inválido')
    })
    })

    describe('forgotPassword', () => {
    it('debe generar token de recuperación si el email existe', async () => {
        const mockUser = { id: 1, email: 'juan@test.com' }
        userRepository.findByEmail.mockResolvedValue(mockUser)
        userRepository.update.mockResolvedValue(mockUser)

        await authService.forgotPassword('juan@test.com')

        expect(userRepository.update).toHaveBeenCalledWith(1,
        expect.objectContaining({
            resetPasswordToken: expect.any(String),
            resetPasswordExpires: expect.any(Date),
        })
        )
    })

    it('no debe lanzar error si el email no existe (protege enumeración de usuarios)', async () => {
        userRepository.findByEmail.mockResolvedValue(null)

        await expect(authService.forgotPassword('noexiste@test.com'))
        .resolves.toBeUndefined()

        expect(userRepository.update).not.toHaveBeenCalled()
    });
    });

    describe('resetPassword', () => {
    it('debe restablecer la contraseña con token válido no expirado', async () => {
        const mockUser = { id: 1, resetPasswordExpires: new Date(Date.now() + 60000) }
        userRepository.findByResetToken.mockResolvedValue(mockUser)
        bcrypt.hash.mockResolvedValue('new_hashed_password')
        userRepository.update.mockResolvedValue(mockUser)

        await authService.resetPassword('valid_token', 'newpassword')

        expect(userRepository.update).toHaveBeenCalledWith(1,
        expect.objectContaining({
            password: 'new_hashed_password',
            resetPasswordToken: null,
            resetPasswordExpires: null,
        })
        )
    })

    it('debe lanzar error si el token no existe', async () => {
        userRepository.findByResetToken.mockResolvedValue(null)

        await expect(authService.resetPassword('bad_token', 'newpass'))
        .rejects.toThrow('Token de recuperación inválido')
    })

    it('debe lanzar error si el token ha expirado', async () => {
        const mockUser = { id: 1, resetPasswordExpires: new Date(Date.now() - 1000) }
        userRepository.findByResetToken.mockResolvedValue(mockUser)

        await expect(authService.resetPassword('expired_token', 'newpass'))
        .rejects.toThrow('El token de recuperación ha expirado')
    })
    })
})

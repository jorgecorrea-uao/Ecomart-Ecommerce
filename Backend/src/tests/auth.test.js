const authService = require('../services/auth.service')
const userRepository = require('../repositories/user.repository')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

jest.mock("../repositories/user.repository")

describe("AuthService - register", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        process.env.JWT_SECRET = "test_secret"
    })

    test("debe registrar un usuario correctamente", async () => {
        userRepository.findByEmail.mockResolvedValue(null)
        userRepository.save.mockResolvedValue({
            id: 1,
            nombre: "Juan Camilo",
            email: "juan@email.com",
            role: "user"
        })

        const result = await authService.register("Juan Camilo", "juan@email.com", "password123")

        expect(result).toHaveProperty("id")
        expect(result.email).toBe("juan@email.com")
        expect(userRepository.save).toHaveBeenCalledTimes(1)
    })

    test("debe lanzar error si el email ya está registrado", async () => {
        userRepository.findByEmail.mockResolvedValue({
            id: 1,
            email: "juan@email.com"
        })

        await expect(authService.register("Juan", "juan@email.com", "password123")).rejects.toThrow("El email ya está registrado")
    })
})

describe("AuthService - login", () => {
    test("debe retornar accessToken, refreshToken y usuario con credenciales correctas", async() => {
        const hashedPassword = await bcrypt.hash("password123", 10)
        userRepository.findByEmail.mockResolvedValue({
            id:1,
            nombre: "Juan Camilo",
            email: "juan@email.com",
            password: hashedPassword,
            role: "user"
        })
        userRepository.update.mockResolvedValue({})

        const result = await authService.login("juan@email.com", "password123")

        expect(result).toHaveProperty("accessToken")
        expect(result.user.email).toBe("juan@email.com")
        expect(result.user).not.toHaveProperty("password")
    })

    test("debe lanzar error si el email no existe", async() => {
        userRepository.findByEmail.mockResolvedValue(null)

        await expect(
            authService.login("noexiste@email.com", "password123")).rejects.toThrow("Email o contraseña incorrectos")
    })

    test("debe lanzar error si la contraseña es incorrecta", async() => {
        const hashedPassword = await bcrypt.hash("pasword123", 10)
        userRepository.findByEmail.mockResolvedValue({
            id: 1,
            email: "juan@email.com",
            password: hashedPassword,
            role: "user"
        })

        await expect(
            authService.login("juan@email.com", "wrongpassword")
        ).rejects.toThrow("Email o contraseña incorrectos")
    })
})
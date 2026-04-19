const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const userRepository = require("../repositories/user.repository")

const authService = {
    async register(nombre, email, password) {
        const existingUser = await userRepository.findByEmail(email)
        if(existingUser) {
            throw new Error("El email ya esta registrado")
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userRepository.save({
            nombre,
            email,
            password: hashedPassword
        })

        return {
            id:user.id,
            nombre: user.nombre,
            email: user.email,
            role: user.role
        }
    },

    async login(email, password) {
        const user = await userRepository.findByEmail(email)
        if(!user) {
            throw new Error("Email o contraseña incorrectos")
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword) {
            throw new Error("Email o contraseña incorrectos")
        }

        const token = jwt.sign(
            {id: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "24h"}
        )

        return {
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                role: user.role
            }
        }
    }
}

module.exports = authService
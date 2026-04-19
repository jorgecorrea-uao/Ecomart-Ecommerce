import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Auth.css"

const Register = () => {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    // Refs para capturar valores aunque el navegador autocomplete sin disparar onChange
    const nombreRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Leer directo del DOM — soluciona el problema del autocompletado del navegador
        const nombre = nombreRef.current.value.trim()
        const email = emailRef.current.value.trim()
        const password = passwordRef.current.value
        const confirmPassword = confirmPasswordRef.current.value

        if (!nombre || !email || !password || !confirmPassword)
            return setError("Por favor completa todos los campos")
        if (password.length < 6)
            return setError("La contraseña debe tener al menos 6 caracteres")
        if (password !== confirmPassword)
            return setError("Las contraseñas no coinciden")

        setLoading(true)
        try {
            const response = await register(nombre, email, password)
            if (response.success) {
                navigate("/login")
            } else {
                setError(response.message || "Error al registrarse")
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error al crear la cuenta")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🛒</div>
                    <h1 className="auth-title">EcoMart</h1>
                    <p className="auth-subtitle">Crea tu cuenta</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                            ref={nombreRef}
                            id="nombre"
                            type="text"
                            name="nombre"
                            placeholder="Tu nombre"
                            autoComplete="name"
                            onChange={() => setError("")}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            ref={emailRef}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            autoComplete="email"
                            onChange={() => setError("")}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            ref={passwordRef}
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                            onChange={() => setError("")}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            ref={confirmPasswordRef}
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Repite tu contraseña"
                            autoComplete="new-password"
                            onChange={() => setError("")}
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>

                <p className="auth-redirect">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
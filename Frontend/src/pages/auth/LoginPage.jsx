import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./auth.css"

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.email || !formData.password)
            return setError("Por favor completa todos los campos")

        setLoading(true)
        try {
            const response = await login(formData.email, formData.password)
            if (response.success) {
                navigate("/home")
            } else {
                setError(response.message || "Error al iniciar sesión")
            }
        } catch (err) {
            setError(err.response?.data?.message || "Email o contraseña incorrectos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🛒</div>
                    <h1 className="auth-title">Ecomart</h1>
                    <p className="auth-subtitle">Inicia sesión en tu cuenta</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Cargando..." : "Iniciar sesión"}
                    </button>
                </form>

                <p className="auth-redirect">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
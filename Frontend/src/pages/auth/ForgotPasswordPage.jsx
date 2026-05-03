import { useState } from "react"
import { Link } from "react-router-dom"
import authService from "../../services/auth.service"
import "./auth.css"

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return setError("Por favor ingresa tu correo electrónico")

        setLoading(true)
        setError("")
        try {
            const response = await authService.forgotPassword(email)
            setSuccess(response.message)
        } catch (err) {
            setError(err.response?.data?.message || "Error al enviar el correo")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🔑</div>
                    <h1 className="auth-title">Recuperar contraseña</h1>
                    <p className="auth-subtitle">Te enviaremos instrucciones a tu correo</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError("") }}
                            autoComplete="email"
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading || !!success}>
                        {loading ? "Enviando..." : "Enviar instrucciones"}
                    </button>
                </form>

                <p className="auth-redirect">
                    <Link to="/login">Volver al inicio de sesión</Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
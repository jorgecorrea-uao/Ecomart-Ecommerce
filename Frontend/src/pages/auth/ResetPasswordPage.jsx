import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import authService from "../../services/auth.service"
import "./auth.css"

const ResetPasswordPage = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!password || !confirmPassword) return setError("Por favor completa todos los campos")
        if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres")
        if (password !== confirmPassword) return setError("Las contraseñas no coinciden")

        setLoading(true)
        setError("")
        try {
            await authService.resetPassword(token, password)
            navigate("/login", { state: { message: "Contraseña restablecida. Ya puedes iniciar sesión." } })
        } catch (err) {
            setError(err.response?.data?.message || "El enlace es inválido o ha expirado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🔒</div>
                    <h1 className="auth-title">Nueva contraseña</h1>
                    <p className="auth-subtitle">Ingresa tu nueva contraseña</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="password">Nueva contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError("") }}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Repite tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError("") }}
                            autoComplete="new-password"
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Restablecer contraseña"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordPage
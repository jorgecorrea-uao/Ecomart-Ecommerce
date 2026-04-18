import { useState } from "react";
import {Link, Navigate, useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import "./Auth.css"

const Login = () => {
    const[formData, setFormData] = useState({email:"", password:""})
    const[error, setError] = useState("")
    const[loading, setLoading] = useState(false)
    const {login} = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
        setError("")
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!formData.email || !formData.password) {
            return setError("Porfavor completa todos los campos")
        }
        setLoading(true)
        try {
            const response = await login(formData.email, formData.password)
            if(response.success) {
                navigate("/home")
            } else {
                setError(response.message || "Error al iniciar sesion")
            }
        } catch(err) {
            setError(err.response?.data?.message ||  "Email o contraseña incorrectos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo"></div>
                    <h1 className="auth-title">Ecomart</h1>
                    <p className="auth-subtitle">Inicia sesion en tu cuenta</p>
                </div>
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {error && <div className="auth-error">{error}</div>}
                        <div className="form-group">
                            <label htmlFor="email">Correo electronico</label>
                            <input id="email"
                            placeholder="tu@email.com"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input id="password"
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password">
                            </input>
                        </div>

                        <button className="auth-btn"
                        type="submit"
                        disabled={loading}>
                            {loading ? "Cargando..." : "Iniciar sesion"}
                        </button>
                    </form>

                    <p className="auth-redirect">
                        No tienes cuenta?{" "}
                        <Link to="/register">Registrate aqui</Link>
                    </p>
            </div>
        </div>
    )
}

export default Login
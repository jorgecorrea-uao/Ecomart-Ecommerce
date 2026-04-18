import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import "./Auth.css"

const Register = () => {
    const[formData, setFormData] = useState({nombre:"", email:"", password:"", confirmPassword: ""})
    const [error, setError] = useState("")
    const[loading, setLoading] = useState(false)
    const {register} = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value})
        setError("")
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const {nombre, email, password, confirmPassword} = formData

        if(!nombre || !email || password || !confirmPassword) 
            return setError("Porfavor completa todos los campos")
        
        if(password.length < 6 )
            return setError("La contraseña debe tener al menos 6 caracteres")
        
        if(password !== confirmPassword)
            return setError("Las contraseñas no coinciden")
        
        setLoading(true)
        try {
            const response = await register(nombre, email, password)
            if(response.success) {
                navigate("/login")
            } else {
                setError(response.message || "Error al registrarse")
            }
        } catch(err) {
            setError(err.response?.data?.message || "Error al crear la cuenta")
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
                    <p className="auth-subtitle">Crea tu cuenta</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre Completo</label>
                        <input id="nombre"
                        type="text"
                        name="nombre"
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        autoComplete="name"></input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo electronico</label>
                        <input
                        id="email"
                        name="email"
                        placeholder="tu@email.com"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"></input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input id="password"
                        type="password"
                        name="password"
                        placeholder="Minimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password">
                        </input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Ingresa nuevamente la contraseña"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                        autoComplete="new-password"></input>
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>

                <p className="auth-redirect">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">Inicia sesion</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
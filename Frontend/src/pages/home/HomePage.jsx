import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./home.css"

const HomePage = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div className="home-wrapper">
            <div className="home-card">
                <div className="home-icon">🌿</div>
                <h2 className="home-title">Bienvenido/a, {user?.nombre || "Usuario"}</h2>
                <p className="home-subtitle">Has iniciado sesión correctamente en Ecomart</p>

                <div className="home-info">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user?.email}</span>
                </div>

                <div className="home-info">
                    <span className="info-label">Rol:</span>
                    <span className="info-badge">{user?.role || "user"}</span>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}

export default HomePage
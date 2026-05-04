import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import "./Navbar.css"

const Navbar = () => {
    const { user, logout } = useAuth()
    const { itemCount } = useCart()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <Link to="/products" className="navbar-brand">
                🛒 EcoMart
            </Link>
            <div className="navbar-links">
                <Link to="/products" className="navbar-link">Productos</Link>
                {user?.role === "admin" && (
                    <Link to="/admin/products" className="navbar-link admin">Admin</Link>
                )}
            </div>
            <div className="navbar-actions">
                {user ? (
                    <>
                        <Link to="/cart" className="navbar-cart">
                            🛍️
                            {itemCount > 0 && (
                                <span className="navbar-cart-badge">{itemCount}</span>
                            )}
                        </Link>
                        <span className="navbar-user">Hola, {user.nombre}</span>
                        <button className="navbar-btn" onClick={handleLogout}>Salir</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-link">Iniciar sesión</Link>
                        <Link to="/register" className="navbar-link primary">Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
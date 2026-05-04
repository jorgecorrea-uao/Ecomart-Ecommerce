import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import CartItemComponent from "../../components/CartItem/CartItem"
import "./CartPage.css"

const CartPage = () => {
    const { cart, loading, itemCount, total, updateQuantity, removeItem, checkout } = useCart()
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const items = cart?.CartItems ?? []

    const handleUpdate = async (itemId, cantidad) => {
        try {
            await updateQuantity(itemId, cantidad)
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar")
        }
    }

    const handleRemove = async (itemId) => {
        try {
            await removeItem(itemId)
        } catch {
            setError("Error al eliminar el item")
        }
    }

    const handleCheckout = async () => {
        setCheckoutLoading(true)
        setError("")
        try {
            await checkout()
            setCheckoutSuccess(true)
        } catch {
            setError("Error al procesar la compra")
        } finally {
            setCheckoutLoading(false)
        }
    }

    if (loading) return <div className="cart-loading">Cargando carrito...</div>

    if (checkoutSuccess) {
        return (
            <div className="cart-success-page">
                <div className="cart-success-card">
                    <span className="cart-success-icon">✅</span>
                    <h2>¡Compra realizada!</h2>
                    <p>Tu pedido ha sido procesado exitosamente.</p>
                    <button onClick={() => { setCheckoutSuccess(false); navigate("/products") }}>
                        Seguir comprando
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1 className="cart-title">Mi carrito</h1>
                <span className="cart-count">{itemCount} {itemCount === 1 ? "producto" : "productos"}</span>
            </div>

            {error && <div className="cart-error">{error}</div>}

            {items.length === 0 ? (
                <div className="cart-empty">
                    <span className="cart-empty-icon">🛒</span>
                    <p>Tu carrito está vacío</p>
                    <button onClick={() => navigate("/products")}>Ver productos</button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {items.map((item) => (
                            <CartItemComponent
                                key={item.id}
                                item={item}
                                onUpdate={handleUpdate}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2 className="cart-summary-title">Resumen</h2>
                        <div className="cart-summary-row">
                            <span>Productos ({itemCount})</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary-divider" />
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            className="cart-checkout-btn"
                            onClick={handleCheckout}
                            disabled={checkoutLoading}
                        >
                            {checkoutLoading ? "Procesando..." : "Finalizar compra"}
                        </button>
                        <button className="cart-continue-btn" onClick={() => navigate("/products")}>
                            Seguir comprando
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage

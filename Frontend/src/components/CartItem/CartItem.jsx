import "./CartItem.css"

const CartItem = ({ item, onUpdate, onRemove }) => {
    const handleDecrease = () => {
        if (item.cantidad === 1) onRemove(item.id)
        else onUpdate(item.id, item.cantidad - 1)
    }

    const handleIncrease = () => {
        onUpdate(item.id, item.cantidad + 1)
    }

    return (
        <div className="cart-item">
            <div className="cart-item-img">🛍️</div>

            <div className="cart-item-info">
                <p className="cart-item-name">{item.nombre}</p>
                <p className="cart-item-price">${Number(item.precio).toFixed(2)} c/u</p>
            </div>

            <div className="cart-item-controls">
                <button className="cart-item-qty-btn" onClick={handleDecrease}>−</button>
                <span className="cart-item-qty">{item.cantidad}</span>
                <button className="cart-item-qty-btn" onClick={handleIncrease}>+</button>
            </div>

            <p className="cart-item-subtotal">
                ${(Number(item.precio) * item.cantidad).toFixed(2)}
            </p>

            <button className="cart-item-remove" onClick={() => onRemove(item.id)}>✕</button>
        </div>
    )
}

export default CartItem

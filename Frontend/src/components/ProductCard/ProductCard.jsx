import { useNavigate } from "react-router-dom"
import "./ProductCard.css"

const ProductCard = ({ product }) => {
    const navigate = useNavigate()

    return (
        <div className="product-card">
            <div className="product-card-img">
                <span className="product-card-emoji">🛍️</span>
            </div>
            <div className="product-card-body">
                {product.categoria && (
                    <span className="product-card-category">{product.categoria}</span>
                )}
                <h3 className="product-card-name">{product.nombre}</h3>
                <p className="product-card-price">${Number(product.precio).toFixed(2)}</p>
                <p className={`product-card-stock ${product.stock === 0 ? "out" : ""}`}>
                    {product.stock === 0 ? "Sin stock" : `Stock: ${product.stock}`}
                </p>
            </div>
            <button
                className="product-card-btn"
                onClick={() => navigate(`/products/${product.id}`)}
            >
                Ver detalle
            </button>
        </div>
    )
}

export default ProductCard

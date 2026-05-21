import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import productService from "../../services/product.service"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import "./ProductDetailPage.css"

const ProductDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addItem } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [addLoading, setAddLoading] = useState(false)
    const [addSuccess, setAddSuccess] = useState(false)
    const [selectedQty, setSelectedQty] = useState(1)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productService.getById(id)
                if (response.success) setProduct(response.data)
            } catch {
                setError("Producto no encontrado")
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = async () => {
        if (!user) return navigate("/login")
        setAddLoading(true)
        try {
            await addItem(product.id, selectedQty)
            setAddSuccess(true)
            setTimeout(() => {
                setAddSuccess(false)
                navigate("/products")
            }, 700)
        } catch (err) {
            setError(err.response?.data?.message || "Error al agregar al carrito")
        } finally {
            setAddLoading(false)
        }
    }

    const decreaseQty = () => {
        setSelectedQty(q => Math.max(1, q - 1))
    }

    const increaseQty = () => {
        setSelectedQty(q => Math.min(product.stock || 1, q + 1))
    }

    if (loading) return <div className="detail-loading">Cargando producto...</div>
    if (error) return (
        <div className="detail-error-page">
            <p>{error}</p>
            <button onClick={() => navigate("/products")}>Volver a productos</button>
        </div>
    )

    return (
        <div className="detail-page">
            <button className="detail-back" onClick={() => navigate("/products")}>
                ← Volver
            </button>

            <div className="detail-card">
                <div className="detail-img">
                    <span className="detail-emoji">🛍️</span>
                </div>

                <div className="detail-info">
                    {product.categoria && (
                        <span className="detail-category">{product.categoria}</span>
                    )}
                    <h1 className="detail-name">{product.nombre}</h1>

                    {product.descripcion && (
                        <p className="detail-description">{product.descripcion}</p>
                    )}

                    <p className="detail-price">${Number(product.precio).toFixed(2)}</p>

                    <div className={`detail-stock-badge ${product.stock === 0 ? "out" : ""}`}>
                        {product.stock === 0
                            ? "Sin stock"
                            : `${product.stock} unidades disponibles`}
                    </div>

                    <div className="detail-qty-row">
                        <div className="qty-controls">
                            <button className="qty-btn" onClick={decreaseQty} disabled={addLoading || product.stock === 0}>−</button>
                            <span className="qty-value">{selectedQty}</span>
                            <button className="qty-btn" onClick={increaseQty} disabled={addLoading || product.stock === 0}>+</button>
                        </div>

                        <button
                            className={`detail-add-btn ${addSuccess ? "success" : ""}`}
                            disabled={product.stock === 0 || addLoading}
                            onClick={handleAddToCart}
                        >
                            {product.stock === 0
                                ? "Sin stock"
                                : addLoading
                                    ? "Agregando..."
                                    : addSuccess
                                        ? "¡Agregado! ✓"
                                        : "Agregar al carrito"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage

import { useState, useEffect } from "react"
import productService from "../../services/product.service"
import ProductCard from "../../components/ProductCard/ProductCard"
import "./ProductsPage.css"

const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [categoria, setCategoria] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const LIMIT = 8

    const fetchProducts = async (cat, pg) => {
        setLoading(true)
        setError("")
        try {
            const response = await productService.getAll({ categoria: cat, page: pg, limit: LIMIT })
            if (response.success) {
                setProducts(response.data.data)
                setTotal(response.data.total)
            }
        } catch {
            setError("Error al cargar los productos")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts(categoria, page)
    }, [categoria, page])

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(1)
        setCategoria(search.trim())
    }

    const handleClear = () => {
        setSearch("")
        setCategoria("")
        setPage(1)
    }

    const totalPages = Math.ceil(total / LIMIT)

    return (
        <div className="products-page">
            <div className="products-header">
                <h1 className="products-title">Productos</h1>
                <p className="products-subtitle">{total} productos disponibles</p>

                <form className="products-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Buscar por categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Buscar</button>
                    {categoria && (
                        <button type="button" className="clear-btn" onClick={handleClear}>
                            Limpiar
                        </button>
                    )}
                </form>

                {categoria && (
                    <p className="products-filter-tag">
                        Filtrando por: <strong>{categoria}</strong>
                    </p>
                )}
            </div>

            {loading && <div className="products-loading">Cargando productos...</div>}
            {error && <div className="products-error">{error}</div>}

            {!loading && !error && products.length === 0 && (
                <div className="products-empty">No se encontraron productos.</div>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="products-grid">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="products-pagination">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span>{page} / {totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProductsPage

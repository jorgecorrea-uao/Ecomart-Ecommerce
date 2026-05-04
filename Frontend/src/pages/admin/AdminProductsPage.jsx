import { useState, useEffect } from "react"
import productService from "../../services/product.service"
import "./AdminProductsPage.css"

const EMPTY_FORM = { nombre: "", descripcion: "", precio: "", stock: "", categoria: "" }

const AdminProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [formError, setFormError] = useState("")
    const [formLoading, setFormLoading] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await productService.getAll({ limit: 100 })
            if (response.success) setProducts(response.data.data)
        } catch {
            setError("Error al cargar los productos")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProducts() }, [])

    const openCreate = () => {
        setEditing(null)
        setForm(EMPTY_FORM)
        setFormError("")
        setModalOpen(true)
    }

    const openEdit = (product) => {
        setEditing(product)
        setForm({
            nombre: product.nombre,
            descripcion: product.descripcion || "",
            precio: product.precio,
            stock: product.stock,
            categoria: product.categoria || "",
        })
        setFormError("")
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY_FORM)
        setFormError("")
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setFormError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.nombre || !form.precio) return setFormError("Nombre y precio son obligatorios")

        setFormLoading(true)
        try {
            if (editing) {
                await productService.update(editing.id, form)
            } else {
                await productService.create(form)
            }
            await fetchProducts()
            closeModal()
        } catch (err) {
            setFormError(err.response?.data?.message || "Error al guardar el producto")
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            await productService.delete(deleteId)
            await fetchProducts()
        } catch {
            setError("Error al eliminar el producto")
        } finally {
            setDeleteId(null)
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Gestión de Productos</h1>
                    <p className="admin-subtitle">{products.length} productos en total</p>
                </div>
                <button className="admin-create-btn" onClick={openCreate}>+ Nuevo producto</button>
            </div>

            {error && <div className="admin-error">{error}</div>}
            {loading && <div className="admin-loading">Cargando...</div>}

            {!loading && products.length === 0 && (
                <div className="admin-empty">No hay productos. Crea el primero.</div>
            )}

            {!loading && products.length > 0 && (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td className="admin-td-name">{p.nombre}</td>
                                    <td>
                                        {p.categoria
                                            ? <span className="admin-category-tag">{p.categoria}</span>
                                            : <span className="admin-no-data">—</span>}
                                    </td>
                                    <td className="admin-td-price">${Number(p.precio).toFixed(2)}</td>
                                    <td>
                                        <span className={`admin-stock-badge ${p.stock === 0 ? "out" : ""}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="admin-td-actions">
                                        <button className="admin-edit-btn" onClick={() => openEdit(p)}>Editar</button>
                                        <button className="admin-delete-btn" onClick={() => setDeleteId(p.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="admin-modal-title">
                            {editing ? "Editar producto" : "Nuevo producto"}
                        </h2>

                        <form className="admin-form" onSubmit={handleSubmit}>
                            {formError && <div className="admin-form-error">{formError}</div>}

                            <div className="form-group">
                                <label>Nombre *</label>
                                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del producto" />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción opcional" rows={3} />
                            </div>
                            <div className="admin-form-row">
                                <div className="form-group">
                                    <label>Precio *</label>
                                    <input name="precio" type="number" step="0.01" min="0.01" value={form.precio} onChange={handleChange} placeholder="0.00" />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="0" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ej: Ropa, Electrónica..." />
                            </div>

                            <div className="admin-modal-actions">
                                <button type="button" className="admin-cancel-btn" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="admin-save-btn" disabled={formLoading}>
                                    {formLoading ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="admin-modal admin-modal-confirm" onClick={(e) => e.stopPropagation()}>
                        <h2 className="admin-modal-title">¿Eliminar producto?</h2>
                        <p className="admin-confirm-text">Esta acción no se puede deshacer.</p>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={() => setDeleteId(null)}>Cancelar</button>
                            <button className="admin-delete-confirm-btn" onClick={handleDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProductsPage

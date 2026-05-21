/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "./AuthContext"
import cartService from "../services/cart.service"
import productService from "../services/product.service"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const { user } = useAuth()
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchCart = useCallback(async () => {
        setLoading(true)
        try {
            if (!user) {
                const guestRaw = localStorage.getItem('guest_cart')
                const guest = guestRaw ? JSON.parse(guestRaw) : []
                const needsFill = guest.some(g => !g.nombre || !g.precio)
                if (needsFill) {
                    for (let i = 0; i < guest.length; i++) {
                        const g = guest[i]
                        if (!g.nombre || !g.precio) {
                            try {
                                const res = await productService.getById(g.productId || g.id)
                                if (res.success) {
                                    guest[i].nombre = res.data.nombre
                                    guest[i].precio = res.data.precio
                                }
                            } catch {
                                // ignore
                            }
                        }
                    }
                    localStorage.setItem('guest_cart', JSON.stringify(guest))
                }

                const items = guest.map(g => ({
                    id: g.productId || g.id,
                    productId: g.productId || g.id,
                    nombre: g.nombre,
                    precio: g.precio,
                    cantidad: g.cantidad,
                }))
                setCart({ CartItems: items })
            } else {
                const response = await cartService.getCart()
                if (response.success) setCart(response.data)
            }
        } catch {
            setCart(null)
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        const mergeGuestCart = async () => {
            const guestRaw = localStorage.getItem('guest_cart')
            const guest = guestRaw ? JSON.parse(guestRaw) : []
            if (guest.length === 0) return
            // Merge each guest item into user's cart
            for (const g of guest) {
                try {
                    await cartService.addItem(g.productId || g.id, g.cantidad)
                } catch {
                    // ignore individual failures
                }
            }
            localStorage.removeItem('guest_cart')
            await fetchCart()
        }

        if (user) {
            mergeGuestCart()
        } else {
            fetchCart()
        }
    }, [fetchCart, user])

    const addItem = async (productId, cantidad = 1) => {
        if (!user) {
            // guest cart in localStorage: store full snapshot at add-time
            try {
                const res = await productService.getById(productId)
                if (!res.success) return { success: false, message: 'Producto no encontrado' }
                const guestRaw = localStorage.getItem('guest_cart')
                const guest = guestRaw ? JSON.parse(guestRaw) : []
                const existing = guest.find(i => (i.productId || i.id) === productId)
                if (existing) {
                    existing.cantidad = Math.max(1, existing.cantidad + cantidad)
                    existing.nombre = existing.nombre || res.data.nombre
                    existing.precio = existing.precio || res.data.precio
                } else {
                    guest.push({ id: productId, productId, cantidad, nombre: res.data.nombre, precio: res.data.precio })
                }
                localStorage.setItem('guest_cart', JSON.stringify(guest))
                await fetchCart()
                return { success: true }
            } catch {
                return { success: false, message: 'No se pudo obtener información del producto' }
            }
        }

        const response = await cartService.addItem(productId, cantidad)
        if (response.success) await fetchCart()
        return response
    }

    const updateQuantity = async (itemId, cantidad) => {
        if (!user) {
            // itemId here is treated as productId for guest cart
            const guestRaw = localStorage.getItem('guest_cart')
            const guest = guestRaw ? JSON.parse(guestRaw) : []
            const idx = guest.findIndex(i => (i.productId || i.id) === itemId)
            if (idx === -1) return { success: false, message: 'Item no encontrado' }
            guest[idx].cantidad = Math.max(1, cantidad)
            localStorage.setItem('guest_cart', JSON.stringify(guest))
            await fetchCart()
            return { success: true }
        }

        const response = await cartService.updateQuantity(itemId, cantidad)
        if (response.success) await fetchCart()
        return response
    }

    const removeItem = async (itemId) => {
        if (!user) {
            const guestRaw = localStorage.getItem('guest_cart')
            const guest = guestRaw ? JSON.parse(guestRaw) : []
            const filtered = guest.filter(i => (i.productId || i.id) !== itemId)
            localStorage.setItem('guest_cart', JSON.stringify(filtered))
            await fetchCart()
            return { success: true }
        }

        const response = await cartService.removeItem(itemId)
        if (response.success) await fetchCart()
        return response
    }

    const checkout = async () => {
        if (!user) return { success: false, message: 'Debes iniciar sesión para completar la compra' }
        const response = await cartService.checkout()
        if (response.success) await fetchCart()
        return response
    }

    const itemCount = cart?.CartItems?.reduce((sum, item) => sum + item.cantidad, 0) ?? 0
    const total = cart?.CartItems?.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0) ?? 0

    return (
        <CartContext.Provider value={{ cart, loading, itemCount, total, addItem, updateQuantity, removeItem, checkout, fetchCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider")
    return context
}

export default CartContext

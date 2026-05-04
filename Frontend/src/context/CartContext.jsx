import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import cartService from "../services/cart.service"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const { user } = useAuth()
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchCart = async () => {
        if (!user) return
        setLoading(true)
        try {
            const response = await cartService.getCart()
            if (response.success) setCart(response.data)
        } catch {
            setCart(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) fetchCart()
        else setCart(null)
    }, [user])

    const addItem = async (productId, cantidad = 1) => {
        const response = await cartService.addItem(productId, cantidad)
        if (response.success) await fetchCart()
        return response
    }

    const updateQuantity = async (itemId, cantidad) => {
        const response = await cartService.updateQuantity(itemId, cantidad)
        if (response.success) await fetchCart()
        return response
    }

    const removeItem = async (itemId) => {
        const response = await cartService.removeItem(itemId)
        if (response.success) await fetchCart()
        return response
    }

    const checkout = async () => {
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

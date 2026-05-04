import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"
import { CartProvider } from "../context/CartContext"
import ProtectedRoute from "./ProtectedRoute"
import Navbar from "../components/Navbar/Navbar"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "../pages/auth/ResetPasswordPage"
import HomePage from "../pages/home/HomePage"
import ProductsPage from "../pages/products/ProductsPage"
import ProductDetailPage from "../pages/products/ProductDetailPage"
import AdminProductsPage from "../pages/admin/AdminProductsPage"
import CartPage from "../pages/cart/CartPage"

const AppRouter = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Navigate to="/products" />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                        <Route
                            path="/home"
                            element={<ProtectedRoute><HomePage /></ProtectedRoute>}
                        />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route
                            path="/admin/products"
                            element={<ProtectedRoute requiredRole="admin"><AdminProductsPage /></ProtectedRoute>}
                        />
                        <Route
                            path="/cart"
                            element={<ProtectedRoute><CartPage /></ProtectedRoute>}
                        />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    )
}

export default AppRouter
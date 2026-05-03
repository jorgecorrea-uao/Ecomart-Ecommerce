import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"
import ProtectedRoute from "./ProtectedRoute"
import Navbar from "../components/Navbar/Navbar"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "../pages/auth/ResetPasswordPage"
import HomePage from "../pages/home/HomePage"

const AppRouter = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                    <Route
                        path="/home"
                        element={<ProtectedRoute><HomePage /></ProtectedRoute>}
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default AppRouter
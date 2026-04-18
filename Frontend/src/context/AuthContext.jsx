import { createContext, useContext, useState, useEffect, Children } from "react"
import authService from "../services/auth.service"

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const[user, setUser] = useState(null)
    const[loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = authService.getCurrentUser()
        if(storedUser) setUser(storedUser)
            setLoading(false)
    }, [])

    const login = async (email, password) => {
        const response = await authService.login(email, password)
        if(response.success) {
            setUser(authService.getCurrentUser())
        }
        return response
    }

    const register = async (nombre, email, password) => {
        return await authService.register(nombre, email, password)
    }
    
    const logout = () => {
        authService.logout()
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) throw new Error("useAuth dee usarse dentro de AuthProvider")
        return context
}

export default AuthContext
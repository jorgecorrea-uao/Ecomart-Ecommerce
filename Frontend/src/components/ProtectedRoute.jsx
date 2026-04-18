import { Navigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { use } from "react"

const ProtectedRoute = ({ children }) => {
    const {user} = useAuth()
    return user ? children : <Navigate to="/login" replace></Navigate>
}

export default ProtectedRoute
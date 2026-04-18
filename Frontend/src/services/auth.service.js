import axios from "axios"

const API_URL = "http://localhost:3000/api/auth"

const authService = {
    async register(nombre, email, password) {
        const response = await axios.post(`${API_URL}/register`, {
            nombre,
            email,
            password
        })
        return response.data
    }, 

    async login(email, password) {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        })
        
        
        if(response.data.success){
            localStorage.setItem("token", response.data.data.accessToken)
            localStorage.setItem("user", JSON.stringify(response.data.data.user))
        }

        return response.data
    },

    logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    },

    getCurrentUser() {
        const user = localStorage.getItem("user")
        return user ? JSON.parse(user) : null
    },

    getToken() {
        return localStorage.getItem("token")
    }
}

export default authService
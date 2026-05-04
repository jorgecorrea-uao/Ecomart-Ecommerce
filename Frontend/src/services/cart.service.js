import api from "./api"

const API_URL = "/cart"

const cartService = {
    async getCart() {
        const response = await api.get(API_URL)
        return response.data
    },

    async checkout() {
        const response = await api.post(`${API_URL}/checkout`)
        return response.data
    },

    async getHistory() {
        const response = await api.get(`${API_URL}/history`)
        return response.data
    },

    async addItem(productId, cantidad = 1) {
        const response = await api.post(`${API_URL}/items`, { productId, cantidad })
        return response.data
    },

    async updateQuantity(itemId, cantidad) {
        const response = await api.put(`${API_URL}/items/${itemId}`, { cantidad })
        return response.data
    },

    async removeItem(itemId) {
        const response = await api.delete(`${API_URL}/items/${itemId}`)
        return response.data
    },
}

export default cartService

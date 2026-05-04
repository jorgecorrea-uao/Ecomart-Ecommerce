import api from "./api"

const API_URL = "/products"

const productService = {
    async getAll({ categoria, page, limit } = {}) {
        const params = {}
        if (categoria) params.categoria = categoria
        if (page) params.page = page
        if (limit) params.limit = limit
        const response = await api.get(API_URL, { params })
        return response.data
    },

    async getById(id) {
        const response = await api.get(`${API_URL}/${id}`)
        return response.data
    },

    async create(data) {
        const response = await api.post(API_URL, data)
        return response.data
    },

    async update(id, data) {
        const response = await api.put(`${API_URL}/${id}`, data)
        return response.data
    },

    async delete(id) {
        const response = await api.delete(`${API_URL}/${id}`)
        return response.data
    },

    async updateStock(id, stock) {
        const response = await api.patch(`${API_URL}/${id}/stock`, { stock })
        return response.data
    },
}

export default productService

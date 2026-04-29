const cartService = require('../services/cart.service')

const cartController = {
    async getCart(req, res, next) {
        try {
            const cart = await cartService.getCart(req.user.id)
            return res.status(200).json({ success: true, data: cart })
        } catch (error) {
            next(error)
        }
    },

    async addItem(req, res, next) {
        try {
            const { productId, cantidad } = req.body
            const cart = await cartService.addItem(req.user.id, productId, cantidad)
            return res.status(200).json({ success: true, data: cart })
        } catch (error) {
            next(error)
        }
    },

    async updateItem(req, res, next) {
        try {
            const { itemId } = req.params
            const { cantidad } = req.body
            const cart = await cartService.updateItem(req.user.id, itemId, cantidad)
            return res.status(200).json({ success: true, data: cart })
        } catch (error) {
            next(error)
        }
    },

    async removeItem(req, res, next) {
        try {
            const { itemId } = req.params
            const cart = await cartService.removeItem(req.user.id, itemId)
            return res.status(200).json({ success: true, data: cart })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = cartController

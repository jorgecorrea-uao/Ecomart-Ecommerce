const { Product } = require('../models')
const cartRepository = require('../repositories/cart.repository')

const cartService = {
    async getOrCreateActiveCart(userId) {
        let cart = await cartRepository.findActiveCartByUser(userId)

        if (!cart) {
            cart = await cartRepository.createCart(userId)
            cart = await cartRepository.findActiveCartByUser(userId)
        }

        return cart
    },

    async getCart(userId) {
        return await this.getOrCreateActiveCart(userId)
    },

    async addItem(userId, productId, cantidad) {
        const cantidadInt = Number(cantidad)
        if (!productId || !cantidadInt || cantidadInt < 1) {
            const error = new Error('ProductId y cantidad válidos son requeridos')
            error.statusCode = 400
            throw error
        }

        const product = await Product.findByPk(productId)
        if (!product) {
            const error = new Error('Producto no encontrado')
            error.statusCode = 404
            throw error
        }

        const cart = await this.getOrCreateActiveCart(userId)
        const existingItem = await cartRepository.findCartItem(cart.id, productId)

        if (existingItem) {
            existingItem.cantidad += cantidadInt
            existingItem.precioUnitario = product.precio
            await existingItem.save()
        } else {
            await cartRepository.createCartItem({
                cartId: cart.id,
                productId,
                cantidad: cantidadInt,
                precioUnitario: product.precio
            })
        }

        return await this.getCart(userId)
    },

    async updateItem(userId, itemId, cantidad) {
        const cantidadInt = Number(cantidad)
        if (!cantidadInt || cantidadInt < 1) {
            const error = new Error('La cantidad debe ser un número entero mayor a 0')
            error.statusCode = 400
            throw error
        }

        const item = await cartRepository.findCartItemById(itemId)
        if (!item || !item.cart || item.cart.userId !== userId) {
            const error = new Error('Item de carrito no encontrado o no pertenece al usuario')
            error.statusCode = 404
            throw error
        }

        await cartRepository.updateCartItem(itemId, { cantidad: cantidadInt })
        return await this.getCart(userId)
    },

    async removeItem(userId, itemId) {
        const item = await cartRepository.findCartItemById(itemId)
        if (!item || !item.cart || item.cart.userId !== userId) {
            const error = new Error('Item de carrito no encontrado o no pertenece al usuario')
            error.statusCode = 404
            throw error
        }

        await cartRepository.removeCartItem(itemId)
        return await this.getCart(userId)
    }
}

module.exports = cartService

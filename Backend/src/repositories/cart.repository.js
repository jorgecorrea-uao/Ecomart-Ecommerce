const { Cart, CartItem, Product } = require('../models')

const cartRepository = {
    async findActiveCartByUser(userId) {
        return await Cart.findOne({
            where: { userId, status: 'active' },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        }
                    ]
                }
            ]
        })
    },

    async createCart(userId) {
        return await Cart.create({ userId })
    },

    async findCartItem(cartId, productId) {
        return await CartItem.findOne({ where: { cartId, productId } })
    },

    async findCartItemById(itemId) {
        return await CartItem.findOne({
            where: { id: itemId },
            include: [{ model: Cart, as: 'cart' }]
        })
    },

    async createCartItem(data) {
        return await CartItem.create(data)
    },

    async updateCartItem(id, data) {
        await CartItem.update(data, { where: { id } })
        return await CartItem.findByPk(id, {
            include: [
                {
                    model: Cart,
                    as: 'cart'
                }
            ]
        })
    },

    async removeCartItem(id) {
        return await CartItem.destroy({ where: { id } })
    }
}

module.exports = cartRepository

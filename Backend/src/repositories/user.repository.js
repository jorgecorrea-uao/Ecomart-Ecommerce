const User = require('../models/user.model')

const userRepository = {
    async findByEmail(email) {
        return await User.findOne({where: {email}})
    },

    async findById(id) {
        return await User.findByPk(id)
    },

    async save(data) {
        return await User.create(data)
    },

    async update(id, data) {
        await User.update(data, {where: {id}})
    },
}

module.exports = userRepository
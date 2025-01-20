const bcrypt = require('bcrypt');
const { User } = require('../models');

const UserService = {
    async getAllUsers() {
        return User.findAll();
    },

    async createUser(userDetails) {
        const hashedPassword = await bcrypt.hash(userDetails.user_password, 10);
        return User.create({ ...userDetails, user_password: hashedPassword });
    },

    async findUserByEmail(email) {
        return User.findOne({ where: { user_email: email } });
    },

    async validatePassword(inputPassword, storedPassword) {
        return bcrypt.compare(inputPassword, storedPassword);
    },

    async getUserById(userId) {
        return User.findByPk(userId);
    },

    async updateUser(userId, userDetails) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');
        Object.assign(user, userDetails);
        user.user_password = await bcrypt.hash(userDetails.user_password, 10);
        await user.save();
        return user;
    },

    async deleteUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');
        await user.destroy();
    },
};

module.exports = UserService;

const bcrypt = require('bcrypt');
const { User } = require('../models');

const UserService = {
    async getAllUsers() {
        return User.findAll();
    },

    async createUser(userDetails) {
        console.log("🔧 회원 데이터 저장 중:", userDetails);  // 회원 정보 로그 찍기

        const hashedPassword = await bcrypt.hash(userDetails.password, 10);
        return User.create({ ...userDetails, password: hashedPassword });
    },

    async findUserByEmail(email) { //이메일을 DB에서 조회하는 함수
        return User.findOne({ where: { email: email } });
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
        user.password = await bcrypt.hash(userDetails.password, 10);
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

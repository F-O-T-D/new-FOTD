const userService = require('../services/userService');

const UserController = {
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error fetching users' });
        }
    },

    async insert(req, res) {
        try {
            console.log("📩 회원가입 요청 도착:", req.body); //디버깅 로그 추가
            
            const user = await userService.createUser(req.body);
            res.json({ success: true, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error registering user' });
        }
    },

    async login(req, res) {
        try {
            const { user_email, user_password } = req.body;
            const user = await userService.findUserByEmail(user_email);
            if (!user) return res.status(404).json({ success: false, error: 'Email not found' });

            const validPassword = await userService.validatePassword(user_password, user.user_password);
            if (!validPassword) return res.status(400).json({ success: false, error: 'Invalid password' });

            res.json({ success: true, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Login error' });
        }
    },

    async getUser(req, res) {
        const userId = req.params.userId;
        try {
            const user = await userService.getUserById(userId);
            if (!user) return res.status(404).json({ success: false, error: 'User not found' });
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error fetching user' });
        }
    },

    async update(req, res) {
        try {
            const user = await userService.updateUser(req.params.userId, req.body);
            res.json({ success: true, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error updating user' });
        }
    },

    async delete(req, res) {
        try {
            await userService.deleteUser(req.params.userId);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error deleting user' });
        }
    },
};

module.exports = UserController;

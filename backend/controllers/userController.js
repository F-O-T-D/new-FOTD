const userService = require('../services/userService');

const userController = {


    // async getAllUsers(req, res) {
    //     try {
    //         const users = await userService.getAllUsers();
    //         res.json(users);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ success: false, error: 'Error fetching users' });
    //     }
    // }, 

    async getMyInfo(req, res) {
        const userId = req.user.id;
        try {
            const user = await userService.getUserById(userId);
            if (!user) return res.status(404).json({ success: false, error: 'User not found' });
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error(error);
            console.error('사용자 조회 오류:', error);
            res.status(500).json({ success: false, error: 'Error fetching user' });
        }
    },

    async updateMyInfo(req, res) {
        const userId = req.user.id;
        try {
            const user = await userService.updateUser(req.params.userId, req.body);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error('사용자 업데이트 오류:', error);
            res.status(500).json({ success: false, error: 'Error updating user' });
        }
    },

    async deleteMyAccount(req, res) {
        const userId = req.user.id;
        try {
            await userService.deleteUser(req.params.userId);
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error('사용자 삭제 오류:', error);
            res.status(500).json({ success: false, error: 'Error deleting user' });
        }
    },
};

module.exports = userController;

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
            console.log("✅ 회원가입 성공:", user);  // 회원가입 성공 여부 확인
            res.json({ success: true, user });
        } catch (error) {
            console.error(error);
            console.error("❌ 회원가입 실패:", error);

            res.status(500).json({ success: false, error: 'Error registering user' });
        }
    },

    async checkEmail(req, res) {
        try {
            const email = req.params.email;
            console.log(`🔍 이메일 중복 확인 요청: ${email}`);

            const user = await userService.findUserByEmail(email);
            res.json({ exists: !!user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error checking email' });
        }
    }, 

    async login(req, res) {
        try {
            const { user_email, user_password } = req.body;
            console.log(`🔑 로그인 요청: 이메일=${user_email}, 비밀번호=${user_password}`);
    
            // 1. 이메일 조회
            const user = await userService.findUserByEmail(user_email);
            if (!user) {
                console.log('❌ [로그인 실패] 이메일이 존재하지 않음');
                return res.status(404).json({ success: false, error: 'Email not found' });
            }
    
            console.log(`✅ [로그인] 이메일 찾음: ${user_email}, 저장된 해시된 비밀번호=${user.user_password}`);
    
            // 2. 비밀번호 검증
            const isPasswordValid = await userService.validatePassword(user_password, user.user_password);
            if (!isPasswordValid) {
                console.log(`❌ [로그인 실패] 비밀번호 불일치. 입력된 비밀번호=${user_password}, 저장된 해시=${user.user_password}`);
                return res.status(400).json({ success: false, error: 'Invalid password' });
            }
    
            console.log(`✅ [로그인 성공] ${user_email}`);
            res.json({ success: true, user });
        } catch (error) {
            console.error('🚨 [로그인 오류] 내부 서버 오류 발생:', error);
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

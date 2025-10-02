//기존 userController에서 회원가입, 로그인 등 인증 관련 기능만 따로 분리


const userService = require('../services/userService');

const authController = {

    //회원가입
    async signup(req, res) {
        try {
            console.log("회원가입 요청 도착:", req.body);
            const { name, email, password } = req.body;

            // 구조 분해 할당, 응답 전체 body 넘기지 말고 필요한 데이터만 명시적으로 골라서 전달함.
            const user = await userService.createUser({ name, email, password });
            console.log("회원가입 성공:", user); 
            res.status(201).json({ success: true, data: user });
            } catch (error) {
                console.log('Signup error', {
                    url: `${API_BASE_URL}/api/auth/signup`,
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                });
                Alert.alert(
                    '회원가입 오류',
                    error.response?.data?.error ?? error.message
                );
                }
    },


    //로그인
    async login(req, res) {
        try {
            const { email, password } = req.body;

            console.log(`로그인 요청: 이메일=${email}, 비밀번호=${password}`);
    
            // 1. 이메일 조회
            const user = await userService.findUserByEmail(email);
            
            if (!user) {
                console.log('[로그인 실패] 이메일이 존재하지 않음');
                return res.status(404).json({ success: false, error: 'Email not found' });
            }
    
            //console.log(`[로그인] 이메일 찾음: ${email}, 저장된 해시된 비밀번호=${user.password}`);
    
            // 2. 비밀번호 검증
            const isPasswordValid = await userService.validatePassword(password, user.password);
            if (!isPasswordValid) {
                //console.log(`[로그인 실패] 비밀번호 불일치. 입력된 비밀번호=${password}, 저장된 해시=${user.password}`);
                return res.status(400).json({ success: false, error: 'Invalid password' });
            }
    
            console.log(`[로그인 성공] ${email}`);
            res.json({ success: true, user });
        } catch (error) {
            console.error('[로그인 오류] 내부 서버 오류 발생:', error);
            res.status(500).json({ success: false, error: 'Login error' });
        }
    },



    //이메일 중복확인
    async checkEmail(req, res) {
        try {
            const email = req.params.email;
            console.log(`이메일 중복 확인 요청: ${email}`);

            const user = await userService.findUserByEmail(email);
            res.status(200).json({ success: true, data: { exists: !!user } }); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error checking email' });
        }
    }, 

};

module.exports = authController;
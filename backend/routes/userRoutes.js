const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const mapController = require('../controllers/mapController');


// API 상태 확인용 (GET /api/user)
router.get('/', (req, res) => {
         res.json({ success: true, message: "User API is working!" });
     });

// 사용자 관련 API
// router.get('/user', userController.getAllUsers);  // 사용자 테이블 조회
// router.post('/insert', userController.insert);  // 사용자 추가
// router.get('/checkEmail/:email', userController.checkEmail); //이메일 중복 확인
// router.post('/login', userController.login);  // 사용자 로그인
// router.get('/:userId', userController.getUser);  // 특정 사용자 조회
// router.put('/:userId', userController.update);  // 사용자 업데이트
// router.delete('/:userId', userController.delete);  // 사용자 삭제


// GET /api/users/:userId (특정 사용자 정보 조회)
router.get('/:userId', userController.getUser);

// PATCH /api/users/:userId (특정 사용자 정보 수정)
router.patch('/:userId', userController.update);

// DELETE /api/users/:userId (회원 탈퇴)
router.delete('/:userId', userController.delete);

module.exports = router;

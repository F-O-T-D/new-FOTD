const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const mapController = require('../controllers/mapController');


// API 상태 확인용 (GET /api/user)
router.get('/', (req, res) => {
         res.json({ success: true, message: "User API is working!" });
     });

// GET /api/users/me (내 정보 조회)
router.get('/me', userController.getMyInfo);

// PATCH /api/users/me (내 정보 수정)
router.patch('/me', userController.updateMyInfo);

// DELETE /api/users/me (회원 탈퇴)
router.delete('/me', userController.deleteMyAccount);

module.exports = router;

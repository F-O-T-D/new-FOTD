const express = require('express');
const userController = require('../controllers/userController');
const mapController = require('../controllers/mapController');
const router = express.Router();

// 사용자 관련 API
router.get('/user_table', userController.getAllUsers);  // 사용자 테이블 조회
router.post('/insert', userController.insert);  // 사용자 추가
router.get('/checkEmail/:email', userController.checkEmail); //이메일 중복 확인
router.post('/login', userController.login);  // 사용자 로그인
router.get('/:userId', userController.getUser);  // 특정 사용자 조회
router.put('/:userId', userController.update);  // 사용자 업데이트
router.delete('/:userId', userController.delete);  // 사용자 삭제

// 지도 관련 API (이전 `routes/user.js`에서 가져온 기능)
router.get('/:userId/store', mapController.getStores);  // 특정 사용자의 가게 목록 조회
router.get('/:userId/store/:storeId', mapController.getStoreById);  // 특정 가게 조회
router.delete('/:userId/store/:storeId', mapController.deleteStore);  // 특정 가게 삭제

module.exports = router;

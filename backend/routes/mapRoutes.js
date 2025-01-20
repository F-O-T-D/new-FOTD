const express = require('express');
const mapController = require('../controllers/mapController');
const router = express.Router();

// 특정 사용자 가게 조회
router.get('/:userId/store', mapController.getStores);

// 특정 사용자 특정 가게 조회
router.get('/:userId/store/:storeId', mapController.getStoreById);

// 특정 사용자 특정 가게 삭제
router.delete('/:userId/store/:storeId', mapController.deleteStore);

module.exports = router;

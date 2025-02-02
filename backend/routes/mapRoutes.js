const express = require('express');
const mapController = require('../controllers/mapController');
const router = express.Router();


// 특정 사용자의 가게 추가 (POST /api/map/:userId)
router.post('/:userId', mapController.addStore);

// 특정 사용자 가게 조회 (GET /api/map/:userId/store)
router.get('/:userId/store', mapController.getStores);

// 특정 사용자 특정 가게 조회 (GET /api/map/:userId/store/:storeId)
router.get('/:userId/store/:storeId', mapController.getStoreById);

// 특정 사용자 특정 가게 삭제 (DELETE /api/map/:userId/store/:storeId)
router.delete('/:userId/store/:storeId', mapController.deleteStore);


module.exports = router;

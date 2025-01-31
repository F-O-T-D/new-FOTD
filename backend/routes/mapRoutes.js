const express = require('express');
const mapController = require('../controllers/mapController');
const router = express.Router();


// ✅ API 상태 확인용 (GET /api/map)
 router.get('/', (req, res) => { //근데 이게 없으면 왜 안 되는 거지?
         res.json({ success: true, message: "Map API is working!" });
     });

// 특정 사용자 가게 조회
router.get('/:userId/map/store', mapController.getStores);
// 특정 사용자 특정 가게 조회
router.get('/:userId/map/store/:storeId', mapController.getStoreById);
// 특정 사용자 특정 가게 삭제
router.delete('/:userId/map/store/:storeId', mapController.deleteStore);
module.exports = router;

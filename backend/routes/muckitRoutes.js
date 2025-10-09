// routes/muckitRoutes.js
const express = require('express');
// { mergeParams: true } 옵션 추가
const router = express.Router({ mergeParams: true });
const muckitController = require('../controllers/muckitController');

// POST /api/users/:userId/muckits
router.post('/', muckitController.addMuckit);

// GET /api/users/:userId/muckits
router.get('/', muckitController.getMyMuckits);

// PATCH /api/users/:userId/muckits/:muckitId
router.patch('/:muckitId', muckitController.updateMuckitStatus);

// DELETE /api/users/:userId/muckits/:muckitId
router.delete('/:muckitId', muckitController.deleteMuckit);

module.exports = router;
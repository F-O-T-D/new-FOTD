const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');

// ✅ 새 일기 추가 (POST는 가장 먼저 등록해야 충돌 방지)
router.post('/:userId/diary', diaryController.addDiary);

// ✅ 특정 날짜의 일기 목록 조회
router.get('/:userId/diaries', diaryController.getDiariesByDate);

// ✅ 특정 일기 상세 조회
router.get('/:userId/diary/:diaryId', diaryController.getDiaryById);

// ✅ 일기 삭제
router.delete('/diary/:diaryId', diaryController.deleteDiary);

module.exports = router;

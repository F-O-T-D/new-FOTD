// const express = require('express');
// const router = express.Router();
// const diaryController = require('../controllers/diaryController');

// // 새 일기 추가 (POST는 가장 먼저 등록해야 충돌 방지)
// router.post('/:userId/diary', diaryController.addDiary);

// // 특정 날짜의 일기 목록 조회
// router.get('/:userId/diaries', diaryController.getDiariesByDate);

// // 특정 일기 상세 조회
// router.get('/:userId/diary/:diaryId', diaryController.getDiaryById);

// // 일기 삭제
// router.delete('/diary/:diaryId', diaryController.deleteDiary);

// module.exports = router;



// routes/diaryRoutes.js
const express = require('express');
// { mergeParams: true } 옵션 추가!
const router = express.Router({ mergeParams: true }); 
const diaryController = require('../controllers/diaryController');
//이 옵션이 있어야 app.js의 :userId 값을 이 파일 안에서 req.params.userId로 읽을 수 있음


// POST /api/users/:userId/diaries
router.post('/', diaryController.addDiary);

// GET /api/users/:userId/diaries
router.get('/', diaryController.getDiaries);

// GET /api/users/:userId/diaries/:diaryId
router.get('/:diaryId', diaryController.getDiaryById);

// PATCH /api/users/:userId/diaries/:diaryId
router.patch('/:diaryId', diaryController.updateDiary);

// DELETE /api/users/:userId/diaries/:diaryId
router.delete('/:diaryId', diaryController.deleteDiary);

module.exports = router;
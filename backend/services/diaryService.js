const Diary = require('../models/diary');  // Diary 모델 가져오기

const diaryService = {  // 기존에 `diaryService`가 아니라 `DiaryService`로 선언됨
    // 특정 날짜의 일기 목록 가져오기
    async getDiariesByDate(userId, date) {
        return await Diary.findAll({ where: { userId, date } });
    },

    // 특정 일기 조회
    async getDiaryById(userId, diaryId) {
        return await Diary.findOne({ where: { userId, id: diaryId } });
    },

    // 일기 추가
    async addDiary(userId, date, title, content, image) {
        return await Diary.create({
            userId,
            date,
            title,
            content,
            image, // 이미지 URL 저장 가능
        });
    },

    // 일기 삭제
    async deleteDiary(diaryId) {
        return await Diary.destroy({ where: { id: diaryId } });
    }
};

module.exports = diaryService;

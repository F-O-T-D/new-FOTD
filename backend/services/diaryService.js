const Diary = require('../models/diary');  // Diary 모델 가져오기

const diaryService = {
    // userId가 일치하는 모든 일기를 찾아 최신순으로 정렬
    async getAllDiariesByUserId(userId) {
        return await Diary.findAll({
            where: { userId },
            order: [['date', 'DESC']],
        });
    },
    
    // 특정 날짜의 일기 목록 가져오기
    async getDiariesByDate(userId, date) {
        return await Diary.findAll({ where: { userId, date } });
    },

    // 특정 일기 조회
    async getDiaryById(userId, diaryId) {
        return await Diary.findOne({ where: { userId, id: diaryId } });
    },

    // 일기 추가
    async addDiary(userId, date, title, content, image, rating) {
        return await Diary.create({
            userId,
            date,
            title,
            content,
            image, // 이미지 URL 저장 가능
            rating,
        });
    },


    async updateDiary(diaryId, updatedData) {
        const diary = await Diary.findByPk(diaryId);
        if (!diary) {
            return null; // 수정할 일기가 없으면 null 반환
        }
        // 찾은 일기 객체에 수정된 데이터를 덮어씌움
        await diary.update(updatedData);
        return diary;
    },

    // 일기 삭제
    async deleteDiary(diaryId) {
        return await Diary.destroy({ where: { id: diaryId } });
    }
};

module.exports = diaryService;

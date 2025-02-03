const diaryService = require('../services/diaryService');

const diaryController = {
    // ✅ 특정 날짜의 일기 조회
    async getDiariesByDate(req, res) {
        try {
            const { userId } = req.params;
            const { date } = req.query;  // 📌 날짜를 쿼리 파라미터에서 가져옴
            const diaries = await diaryService.getDiariesByDate(userId, date);
            res.json(diaries);
        } catch (error) {
            console.error('📌 getDiariesByDate 오류:', error);
            res.status(500).json({ error: '서버 오류' });
        }
    },

    // ✅ 특정 일기 상세 조회
    async getDiaryById(req, res) {
        try {
            const { userId, diaryId } = req.params;
            const diary = await diaryService.getDiaryById(userId, diaryId);
            if (!diary) {
                return res.status(404).json({ error: '일기를 찾을 수 없음' });
            }
            res.json(diary);
        } catch (error) {
            console.error('📌 getDiaryById 오류:', error);
            res.status(500).json({ error: '서버 오류' });
        }
    },

    // ✅ 일기 추가
    async addDiary(req, res) {
        try {
            const { userId } = req.params;
            const { date, content, image } = req.body;
            const newDiary = await diaryService.addDiary(userId, date, content, image);
            res.status(201).json(newDiary);
        } catch (error) {
            console.error('📌 addDiary 오류:', error);
            res.status(500).json({ error: '서버 오류' });
        }
    },

    // ✅ 일기 삭제
    async deleteDiary(req, res) {
        try {
            const { diaryId } = req.params;
            await diaryService.deleteDiary(diaryId);
            res.json({ message: '일기 삭제 완료' });
        } catch (error) {
            console.error('📌 deleteDiary 오류:', error);
            res.status(500).json({ error: '서버 오류' });
        }
    }
};

module.exports = diaryController;

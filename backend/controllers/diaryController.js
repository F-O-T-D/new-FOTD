const diaryService = require('../services/diaryService');

const diaryController = {
    // 특정 날짜의 일기 조회
    async getDiaries(req, res) {
        try {
            const { userId } = req.params;
            const { date } = req.query;  // 날짜를 쿼리 파라미터에서 가져옴
            const diaries = await diaryService.getDiariesByDate(userId, date);
            res.status(200).json({ success: true, data: diaries });
        } catch (error) {
            console.error('일기 목록 조회 오류:', error);
            res.status(500).json({ success: false, error: 'Error fetching diaries' });
        }
    },

    // 특정 일기 상세 조회
    async getDiaryById(req, res) {
        try {
            const { userId, diaryId } = req.params;
            const diary = await diaryService.getDiaryById(userId, diaryId);
            if (!diary) {
                return res.status(404).json({ success: false, error: 'Diary not found' });
            }
            res.status(200).json({ success: true, data: diary });
        } catch (error) {
            console.error('일기 상세 조회 오류:', error);
            res.status(500).json({ success: false, error: 'Error fetching diary' });
        }
    },

    // 일기 추가
    async addDiary(req, res) {
        try {
            const { userId } = req.params;
            // const { date, title, content, image } = req.body;
            // const newDiary = await diaryService.addDiary(userId, date, title, content, image);
           
            const diaryData = req.body; // 데이터를 객체로 묶음 (객체 많아질때 가독성 유지하기 위해)
            const newDiary = await diaryService.addDiary(userId, diaryData);
            
            res.status(201).json({ success: true, data: newDiary });
        } catch (error) {
            console.error('일기 추가 오류:', error);
      res.status(500).json({ success: false, error: 'Error adding diary' });
        }
    },

    // 일기 삭제
    async deleteDiary(req, res) {
        try {
            const { diaryId } = req.params;
            await diaryService.deleteDiary(diaryId);
            res.status(200).json({ success: true, message: 'Diary deleted successfully' });
        } catch (error) {
            console.error('일기 삭제 오류:', error);
            res.status(500).json({ success: false, error: 'Error deleting diary' });
        }
    }
};

module.exports = diaryController;

const muckitService = require('../services/muckitService'); // 서비스 이름도 변경

const muckitController = {
    async getMyMuckits(req, res) { // getStores -> getMyMuckits
        try {
            const muckits = await muckitService.getMuckitsByUserId(req.params.userId);
            res.status(200).json({ success: true, data: muckits });
        } catch (error) {
            console.error('먹킷리스트 조회 오류:', error);
            res.status(500).json({ success: false, error: 'Error fetching muckits' });
        }
    },

    async getMuckitById(req, res) { //getStoreById -> getMuckitById
        try {
            const { userId, id } = req.params;
            const store = await muckitService.getMuckitById(userId, id);
            if (!store) return res.status(404).json({ success: false, error: 'Store not found' });
            res.status(200).json({ success: true, data: store });
        } catch (error) {
            console.error(error);
            console.error('가게 조회 오류:', error);
            res.status(500).json({ success: false, error: 'Error fetching muckits' });
        }
    },


    
    async addMuckit(req, res) { // addStore -> addMuckit
        try {
            const { userId } = req.params;

            // const muckitData = req.body;
            // const newMuckit = await muckitService.addMuckit({ userId, ...muckitData });

            const { name, address, lat, lng } = req.body;
            const newMuckit = await muckitService.addMuckit(userId, name, address, lat, lng);

            res.status(201).json({ success: true, data: newMuckit });
        } catch (error) {
            console.error('먹킷리스트 추가 오류:', error);
      res.status(500).json({ success: false, error: 'Error adding muckit' });
        }
    },

    async updateMuckitStatus(req, res) {
        try {
            const { muckitId } = req.params;
            const { status } = req.body; // 요청의 body에서 새로운 status 값을 가져옴

            const [updatedCount] = await muckitService.updateMuckitStatus(muckitId, status);

            if (updatedCount === 0) {
                return res.status(404).json({ success: false, error: 'Muckit not found' });
            }
            res.status(200).json({ success: true, message: 'Muckit status updated' });
        } catch (error) {
            console.error('먹킷리스트 상태 업데이트 오류:', error);
            res.status(500).json({ success: false, error: 'Error updating muckit status' });
        }
    },
    
        async deleteMuckit(req, res) {  // deleteStore -> deleteMuckit
        try {
            const { muckitId } = req.params; 
            await muckitService.deleteMuckit(muckitId);
            res.status(200).json({ success: true, message: 'Muckit deleted successfully' });
        } catch (error) {
            console.error('먹킷리스트 삭제 오류:', error);
            res.status(500).json({ success: false, error: 'Error deleting muckit' });
        }
    }
};

module.exports = muckitController;

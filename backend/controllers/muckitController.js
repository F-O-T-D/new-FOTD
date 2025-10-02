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

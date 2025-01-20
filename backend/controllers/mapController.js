const mapService = require('../services/mapService');

const MapController = {
    async getStores(req, res) {
        try {
            const stores = await mapService.getStoresByUserId(req.params.userId);
            res.json(stores);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error fetching stores' });
        }
    },

    async getStoreById(req, res) {
        try {
            const { userId, storeId } = req.params;
            const store = await mapService.getStoreById(userId, storeId);
            if (!store) return res.status(404).json({ success: false, error: 'Store not found' });
            res.json(store);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error fetching store' });
        }
    },

    async deleteStore(req, res) {
        try {
            await mapService.deleteStore(req.params.storeId);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error deleting store' });
        }
    },
};

module.exports = MapController;

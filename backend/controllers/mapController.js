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
            const { userId, id } = req.params;
            const store = await mapService.getStoreById(userId, id);
            if (!store) return res.status(404).json({ success: false, error: 'Store not found' });
            res.json(store);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error fetching store' });
        }
    },

    async deleteStore(req, res) {
        try {
            await mapService.deleteStore(req.params.id);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error deleting store' });
        }
    },
    
    async addStore(req, res) {
        try {
            const { userId } = req.params;
            const { name, address, lat, lng } = req.body;
            const newStore = await mapService.addStore(userId, name, address, lat, lng);
            res.status(201).json({ success: true, message: "Store added successfully", store: newStore });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error adding store' });
        }
    }
};

module.exports = MapController;

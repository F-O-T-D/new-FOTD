const Map = require('../models/map');

const MapService = {
    async getStoresByUserId(userId) {
        return Map.findAll({ where: { userId } });
    },

    async getStoreById(userId, storeId) {
        const maps = await Map.findAll({ where: { userId } });
        return maps.find(store => store.storeId === Number(storeId));
    },

    async deleteStore(storeId) {
        return Map.destroy({ where: { storeId } });
    },
};

module.exports = MapService;

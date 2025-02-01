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

    //  // 가게 추가 기능
    //  async addStore(userId, name, address, lat, lng) {
    //     return await db.Store.create({
    //         userId,
    //         name,
    //         address,
    //         latitude: lat,
    //         longitude: lng
    //     });
    // }
};

module.exports = MapService;

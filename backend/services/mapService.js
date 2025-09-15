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

     // 가게 추가 기능
     async addStore(userId, name, address, lat, lng) {
        return await Map.create({ // Map 모델 사용하여 DB에 저장
            userId,
            name,
            address,
            lat,  
            lng   
        });
    }
};

module.exports = MapService;

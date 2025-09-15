const Map = require('../models/map');

const MapService = {
    async getStoresByUserId(userId) {
        return Map.findAll({ where: { userId } });
    },

    async getStoreById(userId, id) {
        const maps = await Map.findAll({ where: { userId } });
        return maps.find(store => store.id === Number(id));
    },

    async deleteStore(id) {
        return Map.destroy({ where: { id } });
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

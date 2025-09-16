const Map = require('../models/map');

const MapService = {
    async getMuckitsByUserId(userId) {
        return Map.findAll({ where: { userId } });
    },

    async getMuckitById(userId, id) {
        const maps = await Map.findAll({ where: { userId } });
        return maps.find(store => store.id === Number(id));
    },

    async deleteMuckit(id) {
        return Map.destroy({ where: { id } });
    },

     // 가게 추가 기능
     async addMuckit(userId, name, address, lat, lng) {
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

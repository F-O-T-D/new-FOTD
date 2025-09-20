const Map = require('../models/map');

const muckitService = {
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

         //return await Map.create(muckitData); // 받은 객체를 그대로 create 함수에 전달
    }
};

module.exports = muckitService;

//User 테이블에 대응하는 Sequelize 모델 정의.

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true, 
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
           email: {
                type: Sequelize.STRING(255),
                allowNull: false,
            }, 
        }, {
            sequelize,
            timestamps: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
        });
    } 
    static associate(db) {
        db.User.hasMany(db.Map, { foreignKey: 'userId', as:'maps'});
    }
};
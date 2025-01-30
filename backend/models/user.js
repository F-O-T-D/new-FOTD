//User 테이블에 대응하는 Sequelize 모델 정의.

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
        {
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true, 
                autoIncrement: true,
                allowNull: false,
            },
            user_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            user_password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
           user_email: {
                type: Sequelize.STRING(255),
                allowNull: false,
            }, 
        }, {
            sequelize,
            timestamps: false,
            modelName: 'User',
            tableName: 'user_table',
            paranoid: false,
        });
    } 
    static associate(db) {
        db.User.hasMany(db.Map, { foreignKey: 'userId', as:'maps'});
    }
};
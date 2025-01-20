//Map 모델 정의
const Sequelize=require('sequelize');


module.exports = class Map extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
            storeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type:Sequelize.INTEGER,
                allowNull:true,
                references: {
                    model: {
                        tableName:'user_table',
                        key:'user_id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                }
            },
            name: {
                type: Sequelize.STRING(225),
                allowNull:true,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull:true
            },
            lng: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            lat: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            create_data: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, 
        {
            sequelize,
            timestamps: false,
            modelName: 'Map',
            tableName: 'user_map',
            paranoid : false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Map.belongsTo(db.User, { foreignKey: 'userId', as:'user'});
    }
};
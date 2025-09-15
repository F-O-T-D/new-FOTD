const { DataTypes, Model } = require('sequelize');

module.exports = class Diary extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                userId: { 
                    type: DataTypes.INTEGER, 
                    allowNull: false,
                    references: { // <- User 테이블과 연결하는 references 반드시 추가
                    model: 'users',
                    key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                date: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                title: { // 제목 추가
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: true,
                }
            },
            {
                sequelize, // Sequelize 인스턴스를 명확히 전달
                modelName: 'Diary',
                tableName: 'diaries',
                timestamps: false,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
}


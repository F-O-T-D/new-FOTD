const { DataTypes, Model } = require('sequelize');

class Diary extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                userId: { type: DataTypes.INTEGER, allowNull: false },
                date: {
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
                sequelize, // ✅ Sequelize 인스턴스를 명확히 전달
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

module.exports = Diary;

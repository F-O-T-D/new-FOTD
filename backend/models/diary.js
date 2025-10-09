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
                },

                rating: {
                    type: DataTypes.STRING, // 이모티콘은 문자열로 저장
                    allowNull: true,      // 평점은 선택 사항일 수 있으므로 null 허용
                },
                muckitId: {
                    type: DataTypes.INTEGER,
                    allowNull: true, // 먹킷리스트에서 온 글이 아닐 수도 있으므로 null 허용
                    references: {
                        model: 'maps', // 'maps' 테이블을 참조
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL', // 가게가 삭제되더라도 일기는 남도록 설정
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
        this.belongsTo(models.Map, { foreignKey: 'muckitId', targetKey: 'id' });
    }
}


//

const Sequelize = require('sequelize');
const dbConfig = require('../config/dbConfig');
const User = require('./user'); // user 모델 가져오기
const Map = require('./map'); // map 모델 가져오기
const Diary = require('./diary'); // Diary 모델 가져오기

// .env 파일의 환경변수 사용
const sequelize = new Sequelize(
    process.env.MYSQL_DB, // 데이터베이스 이름
    process.env.MYSQL_USERNAME, // 사용자 이름
    process.env.MYSQL_PASSWORD, // 비밀번호
    {
        host: process.env.MYSQL_HOST, // 데이터베이스 호스트
        port: process.env.MYSQL_PORT, // 포트
        dialect: 'mysql', // 사용하는 데이터베이스 종류
        logging: true, // SQL 쿼리 로그를 보고 싶으면 true로 변경
    }
);

// 연결 상태 확인
sequelize
    .authenticate()
    .then(() => console.log('Database connection successful.'))
    .catch(err => console.error('Database connection failed:', err));

// 데이터베이스 객체 초기화
const db = {};
db.sequelize = sequelize;
db.User = User;
db.Map = Map;
db.Diary = Diary;

// 모델 초기화
User.init(sequelize);
Map.init(sequelize);
Diary.init(sequelize);

// 모델 간 관계 정의 (associate 함수가 있는 경우만 실행)
if (typeof User.associate === 'function') User.associate(db);
if (typeof Map.associate === 'function') Map.associate(db);
if (typeof Diary.associate === 'function') Diary.associate(db);


module.exports = db;

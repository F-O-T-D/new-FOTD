require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DB, 
  process.env.MYSQL_USERNAME, 
  process.env.MYSQL_PASSWORD, 
  {
    host: process.env.MYSQL_HOST, 
    port: process.env.MYSQL_PORT, 
    dialect: 'mysql', 
    logging: console.log, // ✅ SQL 쿼리 로그 확인 가능
    pool: {
      max: 10, // ✅ 최대 10개 연결 유지
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;  // ✅ Sequelize 인스턴스 내보내기

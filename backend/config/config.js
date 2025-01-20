require('dotenv').config(); // 환경 변수 로드

module.exports = {
    development: {
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
    },
    test: {
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
    },
    production: {
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
    },
};

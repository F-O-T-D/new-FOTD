require('dotenv').config();
const app = require('./app');  // app.js에서 Express 앱 불러오기
const { sequelize } = require('./models');  // DB 연결
const listEndpoints = require('express-list-endpoints');

const PORT = process.env.PORT || 3000;

// DB 연결 확인
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((error) => {
        console.error('데이터베이스 연결 실패:', error);
    });


// 라우트 목록 확인
console.table(listEndpoints(app));

  

// 서버 시작
app.listen(PORT, "0.0.0.0", () => {  
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`http://localhost:${PORT}`);
});


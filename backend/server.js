const app = require('./app');
const { sequelize } = require('./models');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();



// 라우터 임포트
const userRoutes = require('./routes/userRoutes'); // 사용자 관련 라우트
const mapRoutes = require('./routes/mapRoutes');   // 지도 관련 라우트

const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors({
    origin: "*",  // 모든 도메인 허용 (보안 설정 필요 시 특정 도메인만 허용)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(bodyParser.json());



// DB 연결 확인
sequelize.sync({ force: false })
    .then(() => {
        console.log('📊 데이터베이스 연결 성공');

          // 서버 시작
          app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
            console.log(`🌐 http://localhost:${PORT}`);
        });

    })
    .catch((error) => {
        console.error('❌ 데이터베이스 연결 실패:', error);
    });


app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
  });
  




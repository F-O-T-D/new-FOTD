const express = require('express');
const { sequelize } = require('./models');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// 라우터 임포트
const userRoutes = require('./routes/userRoutes'); // 사용자 관련 라우트
const mapRoutes = require('./routes/mapRoutes');   // 지도 관련 라우트

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors({
    origin: "*",  // 모든 도메인 허용 (보안 설정 필요 시 특정 도메인만 허용)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(bodyParser.json());
app.use(
    express.json({
        limit: '50mb',
    })
);

// 라우트 설정
app.use('/api/user', userRoutes);
app.use('/api/user_table/:userId/map', mapRoutes);

// DB 연결 확인
sequelize.sync({ force: false })
    .then(() => {
        console.log('📊 데이터베이스 연결 성공');
    })
    .catch((error) => {
        console.error('❌ 데이터베이스 연결 실패:', error);
    });

// 없는 라우트 처리
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 핸들러
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        success: false,
        message: error.message || '서버 에러가 발생했습니다.',
    });
});

// 서버 시작
app.listen(PORT, "0.0.0.0", () => { //네트워크 바뀌어도 다른 기기에서 접근 가능 설정
    console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`🌐 http://localhost:${PORT}`);
});

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
      console.log(`🛠️ 등록된 라우트: ${r.route.path} [${Object.keys(r.route.methods).join(', ').toUpperCase()}]`);
  }
});

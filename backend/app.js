const express = require('express');
require('dotenv').config();
const cors = require('cors');

// DB 설정 (이제 server.js에서 연결 처리)
require('./config/dbConfig'); 

const userRoutes = require('./routes/userRoutes'); // 사용자 관련 라우트
const mapRoutes = require('./routes/mapRoutes');   // 지도 관련 라우트

const app = express();

// ✅ 미들웨어 설정
app.use(cors({
    origin: "*",  
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));
app.use(express.json({ limit: '50mb' }));

// ✅ 라우트 설정
app.use('/api/user', userRoutes);
app.use('/api/maps', mapRoutes);

// ✅ 없는 라우트 처리
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// ✅ 에러 핸들러
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        success: false,
        message: error.message || '서버 에러가 발생했습니다.',
    });
});

module.exports = app;

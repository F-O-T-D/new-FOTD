const express = require('express');
require('dotenv').config();
const cors = require('cors');

// DB Config 호출 (디버깅용)
require('./config/dbConfig'); // dbConfig.js 강제 호출


const userRoutes = require('./routes/userRoutes'); // 사용자 라우트
const mapRoutes = require('./routes/mapRoutes');  // 지도 라우트

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ✅ API 요청이 도달하는지 확인하는 로그 추가
app.use((req, res, next) => {
    console.log(`📢 API 요청 받음: ${req.method} ${req.url}`);
    next();
});

// ✅ 라우터 추가
app.use('/api/user', userRoutes);
app.use('/api/map', mapRoutes);

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

module.exports = app;

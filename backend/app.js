const express = require('express');
const app = express();
const cors = require('cors');



// 미들웨어 설정
app.use(cors({
    origin: "*",  
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));
app.use(express.json());

// 라우트 설정
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const muckitRoutes = require('./routes/muckitRoutes');

// 독립적인 라우트
app.use('/api/auth', authRoutes);

// 사용자에게 종속된 라우트 (계층적으로 연결)
app.use('/api/users/:userId/diaries', diaryRoutes);
app.use('/api/users/:userId/muckits', muckitRoutes);

// 가장 일반적인 경로
app.use('/api/users', userRoutes);

// 없는 라우트 처리 404
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

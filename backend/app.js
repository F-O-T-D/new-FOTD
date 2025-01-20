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

// 라우터 추가
app.use('/api/users', userRoutes); // 사용자 라우트
app.use('/api/maps', mapRoutes);  // 지도 라우트

module.exports = app;

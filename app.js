import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import groupRoutes from './routes/groupRoute.js';
import commentRoutes from './routes/commentRoute.js';
import badgeRoutes from './routes/badgeRoute.js';
import postRoutes from './routes/postRoute.js';
import * as dotenv from 'dotenv';

dotenv.config();  // 환경 변수를 로드

const app = express();

// CORS 옵션 설정
const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'https://my-project.com'],
};

app.use(cors(corsOptions));  // CORS 설정 적용
app.use(express.json());  // JSON 바디 파싱

// MongoDB 연결
const mongoURI = process.env.DATABASE_URL;  // 환경 변수에서 DB URL을 가져옴

mongoose.set('strictQuery', true);  // strictQuery 설정 추가

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.error('Error connecting to DB:', error);
    process.exit(1);  // 연결 실패 시 프로세스 종료
  });

// 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/groups', groupRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/badges', badgeRoutes); 
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

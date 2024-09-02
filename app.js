import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import groupRoutes from './routes/groupRoute.js';
import commentRoutes from './routes/commentRoute.js';
import badgeRoutes from './routes/badgeRoute.js';
import postRoutes from './routes/postRoute.js';
import * as dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

const app = express();

app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'https://my-todo.com'],
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/groups', groupRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/badges', badgeRoutes); 
app.use('/api', postRoutes);

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import groupRoutes from './routes/groupRoute.js';
import commentRoutes from './routes/commentRoutes.js';
import badgeRoutes from './routes/badgeRoute.js';
import postRoutes from './routes/postRoute.js';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/groups', groupRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/badges', badgeRoutes); 
app.use('/api', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateRoute from './routes/generate.js';
import audioRoute from './routes/audio.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/generate', generateRoute);
app.use('/audio', audioRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

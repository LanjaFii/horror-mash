import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mainRouter from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', mainRouter);

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/horror-mash';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes de base
app.get('/', (req, res) => {
  res.send('HorrorMash API');
});

// Port d'écoute
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('JWT Secret:', process.env.JWT_SECRET);

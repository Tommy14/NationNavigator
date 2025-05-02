import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// ✅ Apply proper CORS config BEFORE your routes
app.use(cors({
  origin: 'https://nation-navigator-pf68.vercel.app/',
  credentials: true                 
}));

// Connect to DB
connectDB();

// ✅ Middleware
app.use(express.json());

// ✅ Your routes (after cors + json)
app.use('/api/users', userRoutes); // example

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
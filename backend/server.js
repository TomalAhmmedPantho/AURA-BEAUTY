import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load routes (we will create these next)
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: ["https://your-aura-beauty.vercel.app", "http://localhost:5173"] }));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);


// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Aura Beauty Database Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
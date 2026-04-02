import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// 1. Import all routes (Including the new Order routes)
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // ✅ Added this

dotenv.config();
const app = express();

// 2. Middleware
// Update your cors middleware in server.js
app.use(cors({ 
  origin: [
    "https://aura-beauty.vercel.app", // Your clean production URL
    "https://aura-beauty-owrvwdjsz-tomalpantho440-2103s-projects.vercel.app", // The specific URL from your error
   // "http://localhost:5173" // For local testing
  ], 
  credentials: true 
}));
app.use(express.json());

// 3. Root Route (Fixes "Cannot GET /" and helps Render health checks)
app.get('/', (req, res) => {
  res.send('🚀 Aura Beauty API is live and running...');
});

// 4. API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes); // ✅ Added this

// 5. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Aura Beauty Database Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// 6. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
});
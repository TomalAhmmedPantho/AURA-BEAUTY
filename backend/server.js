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
// Add this near the top where you define your middleware


const corsOptions = {
  // 1. The VIP List (No trailing slashes at the end of the URLs!)
  origin: [
    "https://frontend-efaf.onrender.com", // Your active Render frontend
    "https://aura-beauty-chi.vercel.app", // Your Vercel frontend (if you keep it)
    "http://localhost:5173"               // For local development
  ],
  
  // 2. Allow Cookies and Authorization Headers (Crucial for User Login/JWT)
  credentials: true, 
  
  // 3. Explicitly allow the methods your app uses
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  
  // 4. Explicitly allow the headers your frontend sends
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply the middleware
app.use(cors(corsOptions));
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
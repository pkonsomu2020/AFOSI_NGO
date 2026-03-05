import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import opportunitiesRoutes from './routes/opportunities.js';
import galleryRoutes from './routes/gallery.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import projectsRoutes from './routes/projects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// CORS configuration - Allow both main website and admin dashboard
const allowedOrigins = [
  'http://localhost:8080',  // Main website (local dev)
  'http://localhost:3000',  // Admin dashboard (local dev)
  'http://localhost:3001',  // Admin dashboard (alternate port)
  'https://afosi.org',      // Production main website
  'https://www.afosi.org',  // Production main website (www)
  'https://admin.afosi.org', // Production admin dashboard
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AFOSI Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AFOSI Backend Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
});

export default app;

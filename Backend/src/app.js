import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import demoRoutes from './routes/demoRoutes.js';

const app = express();

// Configure CORS for Vercel frontend and local development
const rawClientUrl = process.env.CLIENT_URL || '';
const configuredOrigins = rawClientUrl
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelDomain = /^https:\/\/[a-zA-Z0-9-_.]+\.vercel\.app$/.test(origin);

    if (isExplicitlyAllowed || isVercelDomain || configuredOrigins.length === 0) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health Check / Root route
app.get('/', (req, res) => {
  res.json({
    name: 'FixMate API',
    status: 'online',
    version: '1.0.0',
    description: 'PG and Hostel Maintenance Tracker Backend',
  });
});

app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const state = dbStates[mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'OK',
    database: state,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/demo', demoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;


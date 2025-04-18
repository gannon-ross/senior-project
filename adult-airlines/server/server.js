import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reservationRoutes from './routes/reservationRoutes.js';
import authRoutes from './routes/auth.js';
import testEmailRoutes from './routes/testEmail.js';



// Load environment variables
dotenv.config({ path: './server/.env' });


// Initialize express app
const app = express();


const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};


// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// services
app.use('/api/test-email', testEmailRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/reserve', reservationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

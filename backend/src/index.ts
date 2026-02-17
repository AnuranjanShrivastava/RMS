import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the RMS Backend API' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

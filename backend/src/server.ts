import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import adminRoutes from './routes/adminRoutes';
import instructorRoutes from './routes/instructorRoutes';
import postRoutes from './routes/postRoutes';



// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const connectDB = async (): Promise<void> => {
    try {
        const mongoUrl = process.env.MONGO_URI;
        if (!mongoUrl) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        
        await mongoose.connect(mongoUrl);
        console.log('Database Connected Successfully');
    } catch (error) {
        console.error('Database Connection Failed:', error);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/posts', postRoutes);


app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to English Learning Website API' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

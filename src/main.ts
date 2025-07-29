import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

// Import our modules
import { globalErrorHandler, healthCheck, notFound, submitCareerForm } from './controllers';
import { logger } from './logger';
import { upload } from './upload';

// Load environment variables
dotenv.config();

// Express app setup
const app = express();
const PORT = process.env['PORT'] || 3000;

// Rate limiting - 10 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(morgan('combined', {
  stream: {
    write: (message: any) => logger.info(message.trim())
  }
}));

// CORS configuration for subsub.io
app.use(cors({
  origin: ['https://subsub.io'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', healthCheck);
app.post('/submit-career-form', upload.single('cv'), submitCareerForm);

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Careers submission server running on port ${PORT}`);
  logger.info('📧 Email configuration:', {
    host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
    port: process.env['SMTP_PORT'] || '587',
    user: process.env['SMTP_USER'] ? '***configured***' : '❌ NOT SET',
  });
  logger.info('📱 External logging:', {
    telegram: process.env['TELEGRAM_BOT_TOKEN'] && process.env['TELEGRAM_CHAT_ID'] ? '✅ Configured' : '❌ Not configured',
  });
});

export default app;

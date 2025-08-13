import sgMail from '@sendgrid/mail';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

// Import our modules
import { globalErrorHandler, healthCheck, notFound, submitCareerForm } from './controllers';
import { logger } from './logger';
import router from './routes';
import { upload } from './upload';

// Load environment variables
dotenv.config();

// Express app setup
const app = express();
const PORT = process.env['PORT'] || 3000;

console.log(process.env['SENDGRID_API_KEY']);
sgMail.setApiKey(process.env['SENDGRID_API_KEY'] || '');

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
process.env['NODE_ENV'] === 'production' && app.use(limiter);
app.use(morgan('combined', {
  stream: {
    write: (message: any) => logger.info(message.trim())
  }
}));

// CORS configuration - allow multiple origins including null for file:// testing
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    // and from null origin (file:// protocol)
    if (!origin || origin === 'null') {
      return callback(null, true);
    }

    // Allow specific origins
    const allowedOrigins = [
      'https://subsub.io',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // For development, you might want to allow all origins
    // Uncomment the line below for development only:
    // return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', healthCheck);
app.post('/submit-career-form', upload.single('cv'), submitCareerForm);

app.use('/api', router);

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, async () => {
  try {

    logger.info(`🚀 Careers submission server running on port ${PORT}`);
    logger.info('📧 Email configuration:', {
      host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
      port: process.env['SMTP_PORT'] || '587',
      user: process.env['SMTP_USER'] ? '***configured***' : '❌ NOT SET',
    });
    logger.info('📱 External logging:', {
      telegram: process.env['TELEGRAM_BOT_TOKEN'] && process.env['TELEGRAM_CHAT_ID'] ? '✅ Configured' : '❌ Not configured',
    });
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    process.exit(1);
  }
});

export default app;

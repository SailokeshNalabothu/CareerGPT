import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from monorepo root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // Backup to load from local app directory

import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';
import companiesRouter from './routes/companies.js';
import rolesRouter from './routes/roles.js';
import countriesRouter from './routes/countries.js';
import skillsRouter from './routes/skills.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with Credentials (for HTTP-Only Cookie tokens)
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Simple Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Expose API Gateway Endpoints
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/skills', skillsRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Catch-all route
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 CareerGPT API Gateway running at http://localhost:${PORT}`);
});

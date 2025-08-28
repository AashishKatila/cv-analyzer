import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth-route';
import cvRoutes from './routes/cv-routes';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
import { Request, Response, NextFunction } from 'express';

const PORT = process.env.PORT || 5000;

const ai = new GoogleGenAI({});

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://cv-analyzer-psi.vercel.app',
      'https://cv-analyzer-rgoa.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());

// ✅ JSON parser only for JSON requests
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.is('application/json')) {
    bodyParser.json()(req, res, next);
  } else {
    next();
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running ✅');
});

app.use('/api', authRoutes);

app.use('/upload', express.static(path.join(__dirname, '../uploads')));
app.use('/api', cvRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

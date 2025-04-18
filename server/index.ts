import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';


import categoryRoutes from './routes/categories.js';
import subcategoryRoutes from './routes/subcategories.js';
import featureRoutes from './routes/features.js';
import uploadRoutes from './routes/uploads.js';
import reminderRoutes from './routes/reminders.js';
import formRoutes from './routes/forms.js';
import qrRoutes from './routes/qrcode.js';
import emergencyRoutes from './routes/emergency.js';
import emergencyDataRoutes from './routes/emergency-data.js';
import externalSystemsRoutes from './routes/external-systems.js';

import categoryRoutes from './routes/categories';
import subcategoryRoutes from './routes/subcategories';
import featureRoutes from './routes/features';
import uploadRoutes from './routes/uploads';
import reminderRoutes from './routes/reminders';
import formRoutes from './routes/forms';
import qrRoutes from './routes/qrcode';
import emergencyRoutes from './routes/emergency';
import externalSystemsRoutes from './routes/external-systems';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'keeviqo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/user/emergency-contacts', emergencyRoutes);
app.use('/api/user/emergency-data', emergencyDataRoutes);
app.use('/api/external-systems', externalSystemsRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Keeviqo running at http://localhost:${port}`);
});

export default app;

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

import indexRoutes from './routes/indexRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.tailwindcss.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net"
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: ["'self'", "https:", "http:"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// Gzip Compression
app.use(compression());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Assets with cache control
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
  })
);

// View Engine Setup (EJS)
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pass global variables to all views
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.siteUrl = process.env.SITE_URL || 'https://drrajeebkarmakar.com';
  res.locals.currentPath = req.path;
  res.locals.canonicalUrl = `${res.locals.siteUrl}${req.path === '/' ? '' : req.path}`;
  res.locals.pageTitle = 'Dr. Rajeeebshankar Karmakar - Thoracic & Oesophageal Surgeon';
  res.locals.metaDescription = 'Official medical website for Dr. Rajeeebshankar Karmakar, Assistant Professor of Thoracic Surgery and Chest Specialist.';
  next();
});

// Mount Routes
app.use('/', indexRoutes);
app.use('/', pageRoutes);
app.use('/api/appointment', appointmentRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DRRAJEEBKARMAKAR.COM] Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

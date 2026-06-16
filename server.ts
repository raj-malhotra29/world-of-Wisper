import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import expressApp from './src/server/expressApp.js';

const PORT = 3000;

// Serve statically compiled files from the Vite build output
expressApp.use(express.static(path.resolve(process.cwd(), 'dist')));

// Capture all other standard HTML routes to support SPA browser routing (History API fallback)
expressApp.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
});

// Start our high-performance full-stack handler
expressApp.listen(PORT, '0.0.0.0', () => {
  console.log(`World of Whisper server actively safe-keeping secrets on port ${PORT}...`);
});

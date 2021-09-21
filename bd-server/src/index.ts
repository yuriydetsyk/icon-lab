import AWS from 'aws-sdk/global';
import cors from 'cors';
import { config } from 'dotenv-flow';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

import { Database } from './database';
import { apiRouter } from './routers/api';

// Load .env file
config();

// DB (IIFE is used for the top-level await)
(async () => {
  await Database.connect();
})();

// AWS
AWS.config.update({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// API instance
const app = express();

// CORS
app.use(cors({ origin: /.*.?(bubble-doodle\.com|icon-lab\.co)/, credentials: true }));

// Data processing
const UPLOAD_SIZE_LIMIT = '500kb';
app.use(express.urlencoded({ extended: true, limit: UPLOAD_SIZE_LIMIT }));
app.use(express.json({ limit: UPLOAD_SIZE_LIMIT }));

// Routers
app.use('/api', apiRouter);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4800;

if (process.env.API_ENV === 'dev') {
  // SSL & certificates
  const privateKey = fs.readFileSync('./certificates/icon-lab.key');
  const certificate = fs.readFileSync('./certificates/icon-lab.crt');
  const credentials = { key: privateKey, cert: certificate };

  // Initialization & listening
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, '0.0.0.0', () => {
    const prefix = '[Icon Lab API]';
    // console.clear();
    console.log(`${prefix} Started at port ${port}`);
  });
} else {
  // Initialization & listening
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    const prefix = '[Icon Lab API]';
    // console.clear();
    console.log(`${prefix} Started at port ${port}`);
  });
}

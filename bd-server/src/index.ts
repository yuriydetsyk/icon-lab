import AWS from 'aws-sdk/global';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

import { Database } from './database';
import { apiRouter } from './routers/api';

// DB (IIFE is used for the top-level await)
(async () => {
  await Database.connect();
})();

// AWS
process.env.AWS_ACCESS_KEY_ID = process.env.ICONLAB_AWS_ACCESS_KEY_ID;
process.env.AWS_SECRET_ACCESS_KEY = process.env.ICONLAB_AWS_SECRET_ACCESS_KEY;
AWS.config.update({
  region: 'eu-central-1',
  accessKeyId: process.env.ICONLAB_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.ICONLAB_AWS_SECRET_ACCESS_KEY,
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

const port = process.env.ICONLAB_PORT ? parseInt(process.env.ICONLAB_PORT, 10) : 4800;

// Initialization & listening
let server: http.Server | https.Server;
let hostname: string;

if (process.env.ICONLAB_ENV === 'dev') {
  // SSL & certificates
  const privateKey = fs.readFileSync('./certificates/icon-lab.key');
  const certificate = fs.readFileSync('./certificates/icon-lab.crt');
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  hostname = 'local.icon-lab.co';
} else {
  server = http.createServer(app);
}

server.listen(port, hostname, () => {
  const prefix = '[Icon Lab API]';
  console.log(`${prefix} Started at port ${port}`);
});

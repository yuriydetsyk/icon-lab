import AWS from 'aws-sdk/global';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { config, isProduction } from './config';

import { Database } from './database';
import { apiRouter } from './routers/api';

// DB (IIFE is used for the top-level await)
(async () => {
  await Database.connect();
  Database.initModels();
})();

// AWS
process.env.AWS_ACCESS_KEY_ID = config.aws.accessKeyId;
process.env.AWS_SECRET_ACCESS_KEY = config.aws.secretAccessKey;
AWS.config.update({
  region: 'eu-central-1',
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

// API instance
const app = express();

// CORS
app.use(cors({ origin: /.*.?chunkup\.com/, credentials: true }));

// Data processing
const UPLOAD_SIZE_LIMIT = '500kb';
app.use(express.urlencoded({ extended: true, limit: UPLOAD_SIZE_LIMIT }));
app.use(express.json({ limit: UPLOAD_SIZE_LIMIT }));

// Routers
app.use('/api', apiRouter);

// Initialization & listening
let server: http.Server | https.Server;
let hostname: string;

if (!isProduction) {
  // SSL & certificates
  const privateKey = fs.readFileSync('./certificates/icon-lab.key');
  const certificate = fs.readFileSync('./certificates/icon-lab.crt');
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  hostname = 'iconlab.local.chunkup.com';
} else {
  server = http.createServer(app);
}

server.listen(config.server.port, hostname, () => {
  const prefix = '[Icon Lab API]';
  console.log(`${prefix} Started at port ${config.server.port}`);
});

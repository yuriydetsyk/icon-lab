import AWS from 'aws-sdk/global';
import sessionStore from 'connect-session-sequelize';
import cors from 'cors';
import { config } from 'dotenv-flow';
import express from 'express';
import session from 'express-session';
import fs from 'fs';
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

// Session storage
const SequelizeStore = sessionStore(session.Store);
const sessionConfig: session.SessionOptions = {
  store: new SequelizeStore({ db: Database.sequelize }),
  secret: process.env.SESSION_SECRET,
  resave: false, // we support the touch method so per the express-session docs this should be set to false
  saveUninitialized: true,
  name: 'bd.connect.sid',
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, httpOnly: false, sameSite: 'none' }, // 7 days
};
// TODO: check if we need proxy handling
// if (process.env.API_ENV !== Env.Development) {
//   app.set('trust proxy', 1); // trust first proxy
// }
app.use(session(sessionConfig));

// Routers
app.use('/api', apiRouter);

// SSL & certificates
const privateKey = fs.readFileSync('./certificates/icon-lab.key');
const certificate = fs.readFileSync('./certificates/icon-lab.crt');
const credentials = { key: privateKey, cert: certificate };

// Initialization & listening
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(parseInt(process.env.PORT, 10), process.env.HOST, () => {
  const prefix = '[Icon Lab API]';
  // console.clear();
  console.log(`${prefix} Started at https://${process.env.HOST}:${process.env.PORT}`);
});
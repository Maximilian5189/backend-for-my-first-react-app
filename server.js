const https = require('https');
const http = require('http');
const app = require('./app');
const fs = require('fs');
const Sentry = require("@sentry/node");
require('dotenv').config()

Sentry.init({
  dsn: process.env.SENTRY,
});

const port = process.env.PORT || 8000;

let server;
try {
  if(process.env.NODE_ENV === 'production') {
    const options = {
      key: fs.readFileSync('/etc/letsencrypt/live/mybackend.hopto.org/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/mybackend.hopto.org/fullchain.pem')
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(port);
} catch (e) {
  Sentry.captureException(e);
}

const https = require('https');
const http = require('http');
const app = require('./app');
const fs = require('fs');
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://398f14068322415b8e13ff4e7df6f1c0@o503162.ingest.sentry.io/5587861",
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

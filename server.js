const https = require('https');
const app = require('./app');
const fs = require('fs');

const port = process.env.PORT || 8080;

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/mybackend.hopto.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/mybackend.hopto.org/fullchain.pem')
  };

const server = https.createServer(options, app);

server.listen(port);
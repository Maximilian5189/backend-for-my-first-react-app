const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const morgan = require('morgan');

mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(error => console.log(error));
  
mongoose.connection.on('error', err => {
  console.log(err);
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', '*');
  }
  next();
  // res.header('Content-Type', 'application/json');
  // res.header('vary', 'origin,access-control-request-method,access-control-request-headers');
});

const userRoutes = require('./api/routes/user');
const dataRoutes = require('./api/routes/data');

app.use('/user', userRoutes);
app.use('/data', dataRoutes);

app.use((req, res, next) => {
  const error = new Error('not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
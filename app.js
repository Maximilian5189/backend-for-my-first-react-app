const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config()

mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 500000 })
  .catch(error => { throw new Error (`${error}, ${process.env.DB_CONNECTION}`)});

mongoose.connection.on('error', err => {
  throw new Error (`${err}, ${process.env.DB_CONNECTION}`);
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
});

const userRoutes = require('./api/routes/user');
const dataRoutes = require('./api/routes/data');
const ticketRoutes = require('./api/routes/ticket');

app.use('/user', userRoutes);
app.use('/data', dataRoutes);
app.use('/ticket', ticketRoutes);

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

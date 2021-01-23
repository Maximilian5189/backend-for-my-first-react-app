const express = require('express');
const router = express.Router();
const dataControllers = require('../controllers/data');
const checkAuth = require('../middleware/check-auth');
const limiter = require('../middleware/limiter');

router.get('/', limiter, dataControllers.getData);

router.post('/', checkAuth, dataControllers.postData)

module.exports = router;

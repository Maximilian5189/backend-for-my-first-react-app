const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user')
require('dotenv/config');
const checkAuth = require('../middleware/check-auth');
const upload = require('../middleware/multer');
const limiter = require('../middleware/limiter')

router.get('/', limiter, checkAuth, userControllers.getUser);

router.post('/login', limiter, userControllers.userLogin);

router.patch('/', limiter, checkAuth, userControllers.updateUser);

router.post('/add', limiter, upload.single('userImage'), userControllers.addUser);

// router.delete('/', limiter, checkAuth, userControllers.deleteUser);

module.exports = router;

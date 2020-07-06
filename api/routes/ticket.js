const express = require('express');
const router = express.Router();
const ticketControllers = require('../controllers/ticket');
const limiter = require('../middleware/limiter');

router.get('/', limiter, ticketControllers.getTicket);

router.post('/', limiter, ticketControllers.postTicket);

router.patch('/', limiter, ticketControllers.updateTicket);

module.exports = router;
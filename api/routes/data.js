const express = require('express');
const router = express.Router();
const dataControllers = require('../controllers/data');
const checkAuth = require('../middleware/check-auth');
const limiter = require('../middleware/limiter');

router.get('/', limiter, dataControllers.getData);

// router.post('/', checkAuth, (req, res) => {
//     data = new Data({
//         identifier: req.body.Identifier
//     })
//     // Data nur zu vorhandenem User hinzufügen
//     User.findOne({username: req.decoded.user})
//     .then(user => {
//         if (user) {
//             return data.save()
//         }
//     })
//     .then(response => {
//         if (response) {
//             res.json({response, success: true})
//         } else {
//             res.json({success: false})
//         }
//     })
//     .catch(err => {
//         res.json({error: err})
//     })
// })

module.exports = router;
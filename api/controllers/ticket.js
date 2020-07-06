const Ticket = require('../../ticket-model');

exports.getTicket = (req, res) => {
    Ticket.find()
    .then(tickets => {
      res.json({
          success: true,
          tickets: tickets
      });
    })
    .catch(err => { 
      res.json({
        error: err,
        success: false
      })
    })
}

exports.postTicket = (req, res) => {
    if (!req.body.id || req.body.id.length === 0) {
        return res.json({success: false, error: 'Bad request'})
    }
    const ticket = new Ticket({
    id: req.body.id,
    name: req.body.name,
    details: req.body.details
    })
    ticket.save()
    .then(data => {
        res.json({success: true, data});
    })
    .catch(err => {
        if (err.errmsg && err.errmsg.includes('duplicate')) {
        err.duplicate = true;
        }
        res.json({success: false, error: err})
    })
}

exports.updateTicket = (req, res) => {
  Ticket.findOne({id: req.id})
  .then(ticket => {
    const dataToBeSet = { id: req.body.id }
    if (req.body.name) {
      dataToBeSet.name = req.body.name
    } else {
      dataToBeSet.name = ticket.name
    }

    if (req.body.details) {
      dataToBeSet.details = req.body.details
    } else {
      dataToBeSet.details = ticket.details
    }
    Ticket.updateOne({id: req.body.id}, {$set: dataToBeSet})
    .then(data => {
      if (data.nModified > 0) {
        res.json({
          success: true
        });
      } else {
        res.json({
          success: false
        });
      }
    })
    .catch(err => {
      res.json({error: err})
    })
  });
}
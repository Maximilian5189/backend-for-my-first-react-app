const Data = require('../../data-model');

exports.getData = (req, res) => {
    Data.find()
    .then(data => {
      res.json({
          success: true,
          data: data
      });
    })
    .catch(err => { 
      res.json({
        error: err,
        success: false
      })
    })
  }
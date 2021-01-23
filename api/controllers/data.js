const Data = require('../../models/data-model');

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

exports.postData = (req, res) => {
  data = new Data({
    identifier: req.body.identifier
  })

  data.save()
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

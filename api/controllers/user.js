const User = require('../../user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
  
  // todo: für andere Antworten einbauen
  function prepareResponse(userOfSession) {
      let userData = userOfSession;
      if (!userData) {
          return {
            success: false,
            message: 'No user found!' 
          }
      } else {
          return {
            success: true,
            userData: {
              _id: userData._id,
              username: userData.username,
              data: userData.data,
              email: userData.email,
              request: {
                type: 'GET',
                url: 'http://localhost:2000/user/' + userData.username
              }
            }
          }
      }
    }

exports.getUser = (req, res) => {
    User.findOne({username: 'test'})
    .select('_id username data email')
    .then(user => {
      res.json(prepareResponse(user));
    })
    .catch(err => {
      console.log(err)
      res.json({
        error: err,
        success: false
      })
    })
  }

exports.userLogin = (req, res) => {
    if (req.body.token) {
      const result = jwt.verify(req.body.token,process.env.JWT_KEY)
      if (result) {
        res.json({success: true, result})
      }
    } else {
      User.findOne({username: req.body.username})
      .then(user => {
        if (!user) {
          res.json({error: 'Auth failed'})
        } else {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              res.json({error: 'Auth failed'})
            }
            if (result) {
              const token = jwt.sign({user: user.username}, process.env.JWT_KEY, {expiresIn: "24h"});
              res.json({success: true, message: 'Auth successful', token})
            } else {
              res.json({error: 'Auth failed'})
            }
          })
        }
      })
      .catch(err => {
        res.json({error: err})
      })
    }
  }

exports.updateUser = (req, res) => {
    User.findOne({username: req.decoded.user})
    .then(user => {
      if (req.body.password) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.json({success: false, error: err})
          } else {
            User.updateOne({username: req.decoded.user}, {$set: {password: hash}})
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
          }
        });
      } else {
        let dataAlreadyInDB = false;
        let updatedData = user.data;
        if (req.body.data) {
          req.body.data.forEach(requestDataObject => {
            user.data.forEach(DBDataObject => {
              if (requestDataObject.identifier === DBDataObject.identifier) {
                dataAlreadyInDB = true;
              }
            })
            updatedData.push(requestDataObject)
          })
          updatedData = [...new Set(updatedData)];
        }
        if (dataAlreadyInDB) {
          res.json({
            success: false,
            duplicate: true
          })
        } else {
          const dataToBeSet = { data: updatedData }
          if (req.body.email) {
            dataToBeSet.email = req.body.email;
          } else if (req.body.username) {
            dataToBeSet.username = req.body.username;
          }
          User.updateOne({username: req.decoded.user}, {$set: dataToBeSet})
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
            res.json({
              error: err,
              success: false
            })
          })
        }
      }
    })
  }

  exports.addUser = (req, res) => {
    if (!req.body.username || req.body.username.length === 0 || !req.body.password || req.body.password.length === 0) {
      return res.json({success: false, error: 'Username or password missing'})
    }
  
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.json({success: false, error: err})
      } else {
        const user = new User({
          username: req.body.username,
          password: hash,
          email: req.body.email,
          data: req.body.data
        })
        user.save()
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
    })
  }
exports.deleteUser = (req, res) => { // nur mit checkauth!
    User.remove({username: req.body.username})
    .then(data => {
      res.json({
        success: true,
        data: data
      });
    })
        .catch(err => {
          res.json({error: err})
        })
  }

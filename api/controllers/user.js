const User = require('../../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
  
// todo: für andere Antworten einbauen
function prepareResponse(userOfSession) {
  if (!userOfSession) return { success: false, message: 'No user found!' }

  return {
    success: true,
    userData: {
      _id: userOfSession._id,
      username: userOfSession.username,
      data: userOfSession.data,
      email: userOfSession.email,
      request: {
        type: 'GET',
        url: 'http://localhost:2000/user/' + userOfSession.username
      }
    }
  }
}

exports.getUser = (req, res) => {
User.findOne({username: req.decoded.user})
  .select('_id username data email')
  .then(user => res.json(prepareResponse(user)))
  .catch(error => res.json({ error, success: false }));
}

exports.userLogin = (req, res) => {
  if (req.body.token) {
    const result = jwt.verify(req.body.token, process.env.JWT_KEY);
    const success = result ? true : false;
    return res.json({ success, result });
  } else {
    User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) res.json({ error: 'Auth failed' });
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({user: user.username}, process.env.JWT_KEY, {expiresIn: "24h"});
          return res.json({ success: true, message: 'Auth successful', token });
        }
        return res.json({ error: 'Auth failed' });
      });
    })
    .catch(error => res.json({ error }));
  }
}

exports.updateUser = (req, res) => {
  User.findOne({ username: req.decoded.user })
  .then(user => {
    if (!user) return res.json({ success: false })
    if (req.body.password) {
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) return res.json({ success: false, error })

        User.updateOne({ username: req.decoded.user }, {$set: { password: hash }})
          .then(data => {
            const success = data.nModified > 0 ? true : false
            return res.json({ success });
          })
          .catch(error => res.json({ error }));
      });
    } else {
      let duplicate = false;
      let updatedData = user.data || [];
      if (req.body.data && Array.isArray(req.body.data) && Array.isArray(updatedData)) {
        req.body.data.forEach(requestDataObject => {
          user.data.forEach(DBDataObject => {
            duplicate = requestDataObject.identifier === DBDataObject.identifier ? true : duplicate
          });
          if (!updatedData.includes(requestDataObject)) updatedData.push(requestDataObject)
        });
      }

      if (duplicate) return res.json({ success: false, duplicate });

      const dataToBeSet = { data: updatedData }
      if (req.body.email) {
        dataToBeSet.email = req.body.email;
      } else if (req.body.username) {
        dataToBeSet.username = req.body.username;
      }
      User.updateOne({username: req.decoded.user}, {$set: dataToBeSet})
      .then(data => {
        if (data.nModified > 0) res.json({ success: true });
        return res.json({ success: false });
      })
      .catch(error => res.json({ error, success: false }));
    }
  })
}

exports.addUser = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ success: false, error: 'Username or password missing' })
  }

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (error) return res.json({ success: false, error });
    const user = new User({
      username: req.body.username,
      password: hash,
      email: req.body.email,
      data: req.body.data
    })
    user.save()
      .then(data => res.json({ success: true, data }))
      .catch(error => {
        error.duplicate = error.errmsg && error.errmsg.includes('duplicate') ? true : false;
        return res.json({ success: false, error })
      });
  })
}

exports.deleteUser = (req, res) => {
  User.remove({ username: req.decoded.user })
  .then(data => res.json({ success: true, data }))
  .catch(error => res.json({ error }));
}

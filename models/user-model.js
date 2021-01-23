const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true},
    password: {type: String },
    data: Array
})

module.exports = mongoose.model('User', userSchema);
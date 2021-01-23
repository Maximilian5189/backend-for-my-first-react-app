const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    identifier: {type: String, required: true, unique: true }
})

module.exports = mongoose.model('Data', dataSchema);
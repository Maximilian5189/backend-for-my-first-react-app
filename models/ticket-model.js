const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    id: {type: Number, required: true, unique: true },
    name: {type: String},
    details: {type: String}
})

module.exports = mongoose.model('Ticket', ticketSchema);
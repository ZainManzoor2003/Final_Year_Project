const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    session: Number,
    time: Date,

})

const Session = new mongoose.model('Session', sessionSchema);

module.exports = Session;
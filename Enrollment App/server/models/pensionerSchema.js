const mongoose = require('mongoose');

const pensionerSchema = new mongoose.Schema({
    name: String,
    username: String,
    cnic: String,
    email: String,
    password: String,
    number: String,
    address: String,
    dob: String,
    sessions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session"
        }
    ],
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    enable: Boolean

})

const Pensioner = new mongoose.model('Pensioner', pensionerSchema);

module.exports = Pensioner;
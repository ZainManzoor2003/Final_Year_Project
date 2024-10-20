const mongoose = require('mongoose');

const pensionerSchema = new mongoose.Schema({
    name: String,
    cnic: String,
    password: String,
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
    ]

})

const Pensioner = new mongoose.model('Pensioner', pensionerSchema);

module.exports = Pensioner;
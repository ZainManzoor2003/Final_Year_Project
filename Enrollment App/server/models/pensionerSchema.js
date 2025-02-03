const mongoose = require('mongoose');

const pensionerSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    username: { type: String, trim: true },
    cnic: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    number: { type: String, trim: true },
    address: { type: String, trim: true },
    dob: { type: String, trim: true },
    pensionBank: { type: String, trim: true },
    city: { type: String, trim: true },
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
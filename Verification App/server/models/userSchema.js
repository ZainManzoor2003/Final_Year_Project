const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    username: { type: String, trim: true },
    cnic: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    number: { type: String, trim: true },
    address: { type: String, trim: true },
    role: { type: String, trim: true },
    dob: { type: String, trim: true },
    enable: Boolean
})

const User = new mongoose.model('User', userSchema);

module.exports = User;
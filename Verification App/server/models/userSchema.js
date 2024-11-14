const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    cnic: String,
    password: String,
    role:String
})

const User = new mongoose.model('User', userSchema);

module.exports = User;
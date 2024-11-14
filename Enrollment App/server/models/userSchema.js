const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username:String,
    cnic: String,
    email:String,
    password: String,
    number:String,
    address:String,
    role:String,
    dob:String,
    enable:Boolean
})

const User = new mongoose.model('User', userSchema);

module.exports = User;
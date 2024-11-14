const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoPath: String

})

const Video = new mongoose.model('Video', videoSchema);

module.exports=Video;
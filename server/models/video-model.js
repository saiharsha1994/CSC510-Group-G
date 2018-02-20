var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
    videoId: Number,
    enterpriseId: Number,
    description: String,
    title: String,
    likes: Number, 
    views: Number, 
    comments:  [{
       username: String,
       body: String
    }]
});


module.exports = mongoose.model('video', videoSchema, 'videos');
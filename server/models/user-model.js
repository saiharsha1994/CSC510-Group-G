var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userId: Number,
    username: String, 
    emailId: String, 
    password: String,
    coins: Number,
    time: Number, 
    videosViewed: [{
        videoId: Number
    }]
});

module.exports = mongoose.model('user', userSchema, 'users');
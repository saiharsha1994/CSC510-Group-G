var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    tag: String, 
    videoId: Number
});

module.exports = mongoose.model('tag', tagSchema, 'tags');
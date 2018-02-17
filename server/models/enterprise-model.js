var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enterpriseSchema = new Schema({
    enterpriseId: Number,
    ename: String, 
    emailId: String, 
    coins: Number
});

module.exports = mongoose.model('enterprise', enterpriseSchema, 'enterprises');
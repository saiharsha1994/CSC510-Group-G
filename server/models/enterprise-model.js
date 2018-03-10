var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enterpriseSchema = new Schema({
    enterpriseId: Number,
    ename: String, 
    emailId: String,
    password: String, 
    coins: Number,
    coinsPerHour: Number,
    time: Number
});

module.exports = mongoose.model('enterprise', enterpriseSchema, 'enterprises');
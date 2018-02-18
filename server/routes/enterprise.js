const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/enterprise-model');

var busboy = require('connect-busboy');
var fs = require('fs');

let Grid = require('gridfs-stream');
let connection = mongoose.connection;
let gfs;

mongoose.Promise = global.Promise;
Grid.mongo = mongoose.mongo;

mongoose.connect(config.dev.db, function(err){
    if(err){
        console.error(err);
    }else{
        console.log('connected to ' + config.dev.db);
    }
});

connection.once("open", () => {
    
});

router.get('/', function(req, res){
    res.send('Welcome to Enterprise home page!');
});

router.get('/profile', function(req, res){
    res.send('Enterprise Profile page!');
});

router.post('/profile', function(req, res){
    res.send('Enterprise Profile updated successfully');
});

router.get('/stats', function(req, res){
    res.send('Statistics of videos uploaded till now');
});

router.get('/fetch/:id', function (req, res) {
    gfs = Grid(connection.db);
    console.log(req.params.id);
        var readstream = gfs.createReadStream({
              filename: req.params.id
        });
        readstream.pipe(res); 
});

module.exports = router;
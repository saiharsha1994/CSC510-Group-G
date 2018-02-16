const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user-model');
const Video = require('../models/video-model');

mongoose.Promise = global.Promise;

mongoose.connect(config.dev.db, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('connected to ' + config.dev.db);
    }
});

router.get('/', function (req, res) {
    Video.find({}).exec(function (err, videos) {
        if (err) {
            console.error('Error retrieving videos');
        } else {
            res.json(videos);
            //console.log('test');
        }
    });
});

router.get('/profile/:username', function (req, res) {
    User.find({ username: req.params.username }).exec(function (err, user) {
        if (err) {
            console.error('Error retrieving data for ' + req.params.username);
        } else {
            res.json(user);
        }
    });
});

router.post('/profile/:username', function (req, res) {
    res.send('User Profile updated successfully');
});

router.get('/history/:username', function (req, res) {
    User.findOne({ username: req.params.username }).exec(function (err, user) {
        if (err) {
            console.error('Error retrieving data for ' + req.params.username);
        } else {
            if(user){
                res.json(user.videosViewed);
            }
            else{
                res.json(['Null']);
            }
        }
    });
});

router.get('/*', function (req, res) {
    res.redirect('/');
});

module.exports = router;
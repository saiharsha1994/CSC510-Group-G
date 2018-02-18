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

router.post('/like/:id', function(req, res){
    Video.findOne({'videoId': req.params.id}, function(err, video){
        if(err){
            console.error(err);
            res.status(400).send(err);
        } else{
            if(video){ 
                video.likes = video.likes + 1;
                video.save((err, video)=>{
                    if(err){
                        res.status(400).send(err);
                    }else{
                        res.status(200).send('You Liked the video');
                    }
                });

            } else{
                res.status(404).send('Video Not Found');
            }
        }
    });
});

router.post('/profile/update', function (req, res) {
    console.log(req.body.username);
    //{"userId":1223, "username":"haramam", "emailId":"oko@bokka.com"}
    // postman request - localhost:3000/user/profile/update
    var query = {"userId":req.body.userId}//, "emailId":req.body.emailId};
    User.findOne(query, {"userId": true, "emailId": true}, 
        (err, user) => {
            if (err) {
                res.status(400).send(err);
            }
            if (user) {  // Search could come back empty, so we should protect against sending nothing back
                user.emailId = req.body.emailId || user.emailId;
                user.username = req.body.username || user.username;
                user.save((err, user) => {
                    if (err) {
                        res.status(400).send(err)
                    }else{
                        res.status(200).send("user details successfully updated "+user);
                    }
                    
                });
                //res.status(200).send(user)
            } else {  // In case no user was found with the given query
                res.status(404).send("No user found")
            }
        }
    );
    //res.send('User Profile updated successfully');
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
                res.json([]);
            }
        }
    });
});

router.get('/*', function (req, res) {
    res.redirect('/');
});

module.exports = router;
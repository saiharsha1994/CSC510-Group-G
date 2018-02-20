const express = require('express');
const router = express.Router();
const lodash = require('lodash');
var _ = require('underscore');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user-model');
const Enterprise = require('../models/enterprise-model');
const Video = require('../models/video-model');

let Grid = require('gridfs-stream');
let connection = mongoose.connection;
let gfs;

mongoose.Promise = global.Promise;
Grid.mongo = mongoose.mongo;

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
        }
    });
});

router.post('/like/:id', function (req, res) {
    Video.findOne({ 'videoId': req.params.id }, function (err, video) {
        if (err) {
            console.error(err);
            res.status(400).send(err);
        } else {
            if (video) {
                video.likes = video.likes + 1;
                video.save((err, video) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.status(200).send('You Liked the video');
                    }
                });

            } else {
                res.status(404).send('Video Not Found');
            }
        }
    });
});

router.post('/comments/', function (req, res) {
    Video.findOne({ 'videoId': req.body.videoId }, function (err, video) {
        if (err) {
            console.error(err);
            res.status(400).send(err);
        } else {
            if (video) {
                video['comments'].push({ username: req.body.username, body: req.body.comment });
                video.save((err, video) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.status(200).send('Your comment was added');
                    }
                });

            } else {
                res.status(404).send('Video Not Found');
            }
        }
    });
});

// TODO : Handle time
router.post('/viewed', function (req, res) {
    Video.findOne({ 'videoId': req.body.videoId }, function (err, video) {
        if (err) {
            console.error(err);
            res.status(400).send(err);
        } else {
            if (video) {
                video.views = video.views + 1;
                video.save((err, video) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        User.findOne({ 'username': req.body.username }, function (err, user) {
                            if (err) {
                                console.error(err);
                                res.status(400).send(err);
                            } else {
                                if (user) {
                                    user['videosViewed'].push({ videoId: req.body.videoId });
                                    user.time = user.time + req.body.time / 1000;
                                    user.save((err, user) => {
                                        if (err) {
                                            console.error(err);
                                            res.status(400).send(err);
                                        } else {
                                            res.status(200).send('Video viewed');
                                        }
                                    });
                                } else {
                                    res.status(404).send('User not found ' + req.body.userId);
                                }
                            }
                        });
                    }
                });
            } else {
                res.status(404).send('Video Not Found');
            }
        }
    });

});

router.get('/coins/:username', function (req, res) {
    User.findOne({ 'username': req.body.username }, function (err, user) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(user.coins);
        }
    });
});

// post request to update password of the user record.
router.post('/password/update', function (req, res) {
    User.findOne({ "username": req.body.username }, (err, user) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            if (user && (req.body.password === user.password)) {  
                // Search could come back empty, so we should protect against sending nothing back
                user.password = req.body.newpassword || user.password;
                user.save((err, user) => {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        res.status(200).send("Password updated successfully");
                    }

                });
            } else if(req.body.password != user.password){
                res.status(401).send('Passwords do not match!');
            } else {  // In case no user was found with the given query
                res.status(404).send("No user found");
            }
        }
    });
});

router.get('/details/:username', function (req, res) {
    Enterprise.find({
        $where: 'this.coins > this.coinsPerHour'
    }, function (err, enterprises) {
        if (err) {
            res.status(400).send(err);
        } else {
            var enterpriseIds = [];
            _(enterprises).forEach(function (enterprise) {
                enterpriseIds.push({ 'enterpriseId': enterprise.enterpriseId });
            });


            var query = {};
            if(enterpriseIds.length != 0)
                query["$or"] = enterpriseIds;
            //console.log(query);

            Video.find(query, function (err, videos) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    console.log(videos.slice(0, 10));
                    res.status(200).send(videos.slice(0, 10));
                }
            });
        }
    });
});

router.get('/fetch/:id', function (req, res) {
    gfs = Grid(connection.db);
    console.log(req.params.filename);
    var readstream = gfs.createReadStream({
        _id: req.params.id
    });
    readstream.pipe(res);
});

router.get('/history/:username', function (req, res) {
    User.findOne({ 'username': req.params.username }).exec(function (err, user) {
        if (err) {
            console.error('Error retrieving data for ' + req.params.username);
        } else {
            if (user) {
                var videoIds = [];
                _(user.videosViewed).forEach(function (videoId) {
                    videoIds.push(videoId);
                });
                if (videoIds.length != 0) {
                    var query = {};
                    query["$or"] = videoIds;

                    Video.find(query, function (err, videos) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.status(200).send(videos);
                        }
                    });
                } else {
                    res.status(404).send('You have not watched any videos till now');
                }
            }
            else {
                res.json([]);
            }
        }
    });
});

router.get('/*', function (req, res) {
    res.redirect('/');
});

module.exports = router;
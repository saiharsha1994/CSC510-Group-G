const express = require('express');
const router = express.Router();
const lodash = require('lodash');
var _ = require('underscore');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user-model');
const Enterprise = require('../models/enterprise-model');
const Video = require('../models/video-model');
const Tag = require('../models/tag-model');

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
            res.status(400).send(err);
        } else {
            res.json(videos);
        }
    });
});

router.post('/like/:id', function (req, res) {
    Video.findOne({ 'videoId': req.params.id }, function (err, video) {
        if (err) {
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

router.post('/viewed', function (req, res) {
    Video.findOne({ 'videoId': req.body.videoId }, function (err, video) {
        if (err) {
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
                                res.status(400).send(err);
                            } else {
                                if (user) {
                                    user['videosViewed'].push({ videoId: req.body.videoId });
                                    user.time = user.time + req.body.time;
                                    user.save((err, user) => {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            Enterprise.findOne({ 'enterpriseId': video.enterpriseId }, function (err, enterprise) {
                                                if (err) {
                                                    res.status(400).send(err);
                                                } else {
                                                    if (enterprise) {
                                                        var time = req.body.time / 60000;
                                                        enterprise.time = enterprise.time + time;
                                                        while (enterprise.time > 5) {
                                                            enterprise.time = enterprise.time - 5;
                                                            enterprise.coins = enterprise.coins - enterprise.coinsPerHour;
                                                        }
                                                        enterprise.save((err, ent) => {
                                                            if (err) {
                                                                res.status(400).send(err);
                                                            } else {
                                                                res.status(200).send('Video viewed');
                                                            }
                                                        });
                                                    } else {
                                                        res.send(404).send('No enterprise found');
                                                    }
                                                }
                                            });

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
    User.findOne({ 'username': req.params.username }, function (err, user) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(user);
        }
    });
});

router.post('/profile/update', function (req, res) {
    var query = { "username": req.body.username }//, "emailId":req.body.emailId};
    User.findOne(query, { "username": true, "emailId": true },
        (err, user) => {
            if (err) {
                res.status(400).send(err);
            }
            if (user && (req.body.password === user.password)) {  // Search could come back empty, so we should protect against sending nothing back
                user.password = req.body.newpassword || user.password;
                //user.emailId = req.body.emailId || user.emailId;
                user.save((err, user) => {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        res.status(200).send("Password successfully updated ");
                    }

                });
            } else {  // In case no user was found with the given query
                res.status(404).send("No user found")
            }
        }
    );
    //res.send('User Profile updated successfully');
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
            if (enterpriseIds.length != 0) {
                query["$or"] = enterpriseIds;
            }

            Video.find(query, function (err, videos) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    //limit the videos fetched to 10 and send the trimmed video ids
                    res.status(200).send(videos.slice(0, 10));
                }
            });
        }

    });
});

router.get('/fetch/:id', function (req, res) {

    if (req.params.id == 'undefined') {
        res.status(401).send('Unauthorized');
    }
    else {
        gfs = Grid(connection.db);
        gfs.exist({ _id: req.params.id }, function (err, found) {
            if (err) {
                res.status(400).send(err);
            } else {
                if (found) {
                    var readstream = gfs.createReadStream({
                        _id: req.params.id
                    });
                    readstream.pipe(res);
                } else {
                    res.status(404).send('Video file not found');
                }
            }
        });
    }

});

router.post('/search', function (req, res) {

    Enterprise.find({
        $where: 'this.coins > this.coinsPerHour'
    }, function (err, enterprises) {
        var tags = [];
        _(req.body.tags).forEach(function (tag) {
            tags.push({ 'tag': tag });
        });

        var query = {};

        if (!_.isEmpty(tags)) {
            query["$or"] = tags;
        }
        Tag.find(query).distinct('videoId', function (err, results) {
            if (err) {
                res.status(400).send(err);
            } else {
                var enterpriseIds = [];
                _(enterprises).forEach(function (enterprise) {
                    enterpriseIds.push(enterprise.enterpriseId);
                });

                var tags = [];

                _(req.body.tags).forEach(function (tag) {
                    tags.push({ 'tag': tag });
                });

                var query = {};
                if (!_.isEmpty(tags)) {
                    query["$or"] = tags;
                }

                Tag.find(query).distinct('videoId', function (err, results) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        var videoIds = [];
                        var videoQuery = {};
                        _(results).forEach(function (result) {
                            videoIds.push({ 'videoId': result });
                        });
                        videoQuery["$or"] = videoIds;
                        Video.find(videoQuery, function (err, videos) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                var results = [];
                                _(videos).forEach(function (video) {
                                    if (enterpriseIds.indexOf(video.enterpriseId) != -1) {
                                        results.push(video);
                                    }
                                });
                                res.status(200).send(results);
                            }
                        });
                    }
                });
            }
        });
    });
});

router.post('/redeem', function (req, res) {
    User.findOne({ 'username': req.body.username }).exec(function (err, user) {
        if (err) {
            res.status(400).send(err);
        } else {
            if (user) {
                var time = Math.floor(user.time / 60000);
                user.time = user.time - time * 60000;
                user.coins = user.coins + time;
                user.save((err, user) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.status(200).send(user);
                    }
                });
            }
        }
    });
});

router.get('/history/:username', function (req, res) {
    User.findOne({ 'username': req.params.username }).exec(function (err, user) {
        if (err) {
            res.status(400).send(err);
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
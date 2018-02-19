const express = require('express');
const router = express.Router();
const lodash = require('lodash');
var _ = require('underscore');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user-model');
const Enterprise = require('../models/enterprise-model');
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

router.get('/user/coins/:username', function (req, res) {
    User.findOne({ 'username': req.body.username }, function (err, user) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(user.coins);
        }
    });
});

router.post('/profile/update', function (req, res) {
    console.log(req.body.username);
    //{"userId":1223, "username":"haramam", "emailId":"oko@bokka.com"}
    // postman request - localhost:3000/user/profile/update
    var query = {"userId":req.body.username}//, "emailId":req.body.emailId};
    User.findOne(query, {"userId": true, "emailId": true}, 
        (err, user) => {
            if (err) {
                res.status(400).send(err);
            }
            if (user && (req.body.password === user.password)) {  // Search could come back empty, so we should protect against sending nothing back
                user.password = req.body.newpassword || user.password;
                user.emailId = req.body.emailId || user.emailId;
                user.save((err, user) => {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        res.status(200).send("user details successfully updated " + user);
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
            query["$or"] = enterpriseIds;

            Video.find(query, function (err, videos) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    console.log(videos.slice(0, 10));
                    res.status(200).send(videos.slice(0, 10));
                }
            });

            //res.status(200).send(enterprises);
        }

    });

    //console.log(req.body.username);
    //{"userId":1223, "username":"haramam", "emailId":"oko@bokka.com"}
    // postman request - localhost:3000/user/profile/update
    //var query = {"userId":req.body.userId}//, "emailId":req.body.emailId};
    // Enterprise.find().sort({ coinsPerHour: -1 }).exec(function (err, enterprises){
    //     if(err){
    //         res.status(400).send(err)
    //     }
    //     if(enterprises){
    //         console.log(enterprises);
    //         var enterprise_list=_.map(enterprises, function(e){
    //             return e.enterpriseId;
    //         });
    //         console.log(enterprise_list);
    //         var video_ids_to_display = [];
    //             //fetch_video(array, element) {
    //                 var found = false; // The element we've not found just yet.

    //                 _(enterprise_list).forEach(function(item) {
    //                 var query = {"enterpriseId":item};
    //                 Video.find( query, (err,video)=>{
    //                     var video_list=_.map(video, function(e){
    //                         return e.videoId;
    //                     });
    //                     console.log(video_list);
    //                     _.each(video_list, function(v,i){
    //                         console.log(v);
    //                         video_ids_to_display.push(v);
    //                         console.log(video_ids_to_display+"ok ok ");
    //                       });
    //                     //video_ids_to_display.push(video_list);
    //                     //Array.prototype.push.apply(video_ids_to_display, video_list);
    //                 });
    //                 console.log(video_ids_to_display+"present array");
    //                 if(video_ids_to_display.length >=10)
    //                     return false;
    //                     // We found the element!
    //                     // Let's acknowledge that, then break off the looping.                        
    //                 });

    //                // return found;
    //             //}
    //         res.status(200).send(video_ids_to_display);
    //     }
    //     else{
    //         res.status(200).send("not a good query");
    //     }
    // });
    // User.findOne(query, {"userId": true, "emailId": true}, 
    //     (err, user) => {
    //         if (err) {
    //             res.status(200).send(err)
    //         }
    //         if (user) {  // Search could come back empty, so we should protect against sending nothing back
    //             user.emailId = req.body.emailId || user.emailId;
    //             user.username = req.body.username || user.username;
    //             user.save((err, user) => {
    //                 if (err) {
    //                     res.status(500).send(err)
    //                 }
    //                 res.status(200).send("user details successfully updated"+user);
    //             });
    //             //res.status(200).send(user)
    //         } else {  // In case no user was found with the given query
    //             res.status(200).send("No user found")
    //         }
    //     }
    // );
    //res.send('User Profile updated successfully');
});


router.get('/history/:username', function (req, res) {
    User.findOne({ 'username': req.params.username }).exec(function (err, user) {
        if (err) {
            console.error('Error retrieving data for ' + req.params.username);
        } else {
            if (user) {
                var videoIds = [];
                _(user.videosViewed).forEach(function (videoId) {
                    videoIds.push( videoId );
                });
                if (videoIds.length != 0) {
                    var query = {};
                    query["$or"] = videoIds;
                    console.log(query);

                    Video.find(query, function (err, videos) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.status(200).send(videos);
                        }
                    });
                }else{
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
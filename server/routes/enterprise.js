const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config');
const Enterprise = require('../models/enterprise-model');
const Video = require('../models/video-model');
const Tag = require('../models/tag-model');
var _ = require('underscore');
//var busboy = require('connect-busboy');
var fs = require('fs');

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

connection.once("open", () => {
    gfs = Grid(connection.db);

    router.post('/uploadVideo', (req, res) => {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log("Uploading: " + filename + ' mimetype : ' + mimetype);
            fstream = gfs.createWriteStream({
                filename: filename,
                mode: 'w'
                //content_type: part.mimetype
            });
            //fstream = fs.createWriteStream(__dirname + '/files/' + filename);
            file.pipe(fstream);
            fstream.on('close', function (video) {
                console.log('uploaded successfully');
                res.status(200).send(video);
            });
        });
    });


});

router.post('/videoDetails', function (req, res) {
    Video.findOne().sort({ videoId: -1 }).limit(1).exec(function (err, video) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            Enterprise.findOne({ 'ename': req.body.username }, function (err, enterprise) {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                } else {

                    let new_videoId = ((video == null) ? 0 : video.videoId) + 1;
                    var record = {
                        'videoId': new_videoId,
                        'enterpriseId': enterprise.enterpriseId,
                        'description': req.body.description,
                        'title': req.body.title,
                        'fileId': req.body.fileId,
                        'likes': 0,
                        'views': 0,
                        'comments': []
                    };

                    let new_video = Video(record);
                    new_video.save((err, video) => {
                        if (err) {
                            console.log(err);
                            res.status(400).send(err);
                        } else {
                            var tags = [];
                            _(req.body.tags).forEach(function(tag){
                                tags.push({'tag' : tag, 'videoId' : new_videoId});
                            });
                            Tag.insertMany(tags, function(err, docs){
                                if(err){
                                    console.log(err);
                                    res.status(400).send(err);
                                }else{
                                    res.status(200).send('Video Upload successful');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/', function (req, res) {
    res.send('Welcome to Enterprise home page!');
});

router.get('/details/:ename', function (req, res) {
    console.log(req.params.ename);
    Enterprise.findOne({ 'ename': req.params.ename }, function (err, record) {
        if (err) {
            console.error('error in getting the ' + req.params.ename + ' record');
            res.status(400).send(err);
        }
        else {
            if (record) {
                var query = {
                    'enterpriseId': record.enterpriseId
                };

                console.log(query);
                Video.find(query, function (err, videos) {
                    if (err) {
                        console.error('error in retrieving the ' + record.enterpriseId + 'videos');
                        res.status(400).send(err);
                    } else {
                        var response_record = {
                            'coins': record.coins,
                            'coinsPerHour': record.coinsPerHour,
                            'videos': videos
                        }
                        res.status(200).send(response_record);
                    }
                });
            }
        }
    });
});

router.get('/profile', function (req, res) {

    res.send('Enterprise Profile page!');
});

router.post('/profile/update', function (req, res) {
    Enterprise.findOne({ "ename": req.body.username },
        (err, enterprise) => {
            if (err) {
                res.status(400).send(err);
            }
            if (enterprise && (req.body.password === enterprise.password)) {  // Search could come back empty, so we should protect against sending nothing back
                enterprise.password = req.body.newpassword || enterprise.password;
                enterprise.save((err, enterprise) => {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        res.status(200).send("Password changed successfully");
                    }
                });
            } else {  // In case no enterprise was found with the given query
                res.status(404).send("No Enterprise found")
            }
        }
    );
});

router.post('/profile/update', function (req, res) {
    console.log(req.body.enterpriseId);
    var query = { "enterpriseId": req.body.enterprise }//, "emailId":req.body.emailId};
    Enterprise.findOne(query, { "enterpriseId": true, "emailId": true },
        (err, enterprise) => {
            if (err) {
                res.status(200).send(err)
            }
            if (enterprise && (req.body.password === enterprise.password)) {  // Search could come back empty, so we should protect against sending nothing back
                enterprise.password = req.body.newpassword || enterpriseId.password;
                enterprise.emailId = req.body.emailId || enterprise.emailId;
                //enterprise.ename = req.body.ename || enterprise.ename; username cannot be updated as it is unique
                enterprise.save((err, enterprise) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    res.status(200).send("enterprise details successfully updated" + enterprise);
                });
                //res.status(200).send(enterprise)
            } else {  // In case no enterprise was found with the given query
                res.status(200).send("No enterprise found")
            }
        }
    );
    //res.send('Enterprise Profile updated successfully'+req.body);
});

router.get('/stats', function (req, res) {
    res.send('Statistics of videos uploaded till now');
});

module.exports = router;
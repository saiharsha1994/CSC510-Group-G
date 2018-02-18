const express = require('express');
const path = require('path');
const config = require('./config/config');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const async = require('async');
const busboy = require('connect-busboy');

app.use(cors());
app.use(bodyParser());
app.use(busboy());

// Initialize user route and model
var user_route = require('./routes/user');
var user_model = require('./models/user-model');
app.use('/user', user_route);

// Initialize enterprise route and model
var enterprise_route = require('./routes/enterprise');
var enterprise_model = require('./models/enterprise-model');
app.use('/enterprise', enterprise_route);

var account_type;
var account_route;
var account_model;

app.put('/', function (req, res) {

    // Determine if the account belongs to User or enterprise and initialize accordingly
    account_type = (req.body.isUser) ? 'user' : 'enterprise';

    account_route = require('./routes/' + account_type);
    account_model = require('./models/' + account_type + '-model');
    app.use('/' + account_type, account_route);

    if (req.body.isUser) {
        var query = {
            "$or":
                [
                    { 'username': req.body.username },
                    { 'emailId': req.body.email }
                ]
        };

        account_model.count(query, function (error, count) {
            if (count != 0) {
                res.status(409).send('Username/Email already exists. Please choose a new one');
            } else {
                account_model.findOne().sort({ userId: -1 }).limit(1).exec(function (err, object) {
                    if (err) {
                        console.error(err);
                    } else {

                        let new_userId = ((object == null) ? 0 : object.userId) + 1;
                        var record = {
                            'userId': new_userId,
                            'emailId': req.body.email,
                            'username': req.body.username,
                            'password': req.body.password,
                            'coins': 0,
                            'videosViewed': []
                        };

                        let user = new account_model(record);
                        user.save((err, record) => {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.status(200).send('Created successfully');
                            }
                        });
                    }
                });
            }
        });
    } else {

        var query = {
            "$or":
                [
                    { 'ename': req.body.username },
                    { 'emailId': req.body.email }
                ]
        };

        account_model.count(query, function (error, count) {
            if (count != 0) {
                res.status(409).send('Enterprise Name/Email already exists. Please choose a new one');
            } else {
                account_model.findOne().sort({ enterpriseId: -1 }).limit(1).exec(function (err, object) {
                    if (err) {
                        console.error(err);
                    } else {

                        let new_enterpriseId = ((object == null) ? 0 : object.enterpriseId) + 1;
                        var record = {
                            'enterpriseId': new_enterpriseId,
                            'emailId': req.body.email,
                            'ename': req.body.username,
                            'password': req.body.password,
                            'coins': 0,
                            'coinsPerHour': 0
                        };

                        let enterprise = new account_model(record);
                        enterprise.save((err, record) => {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.status(200).send('Created successfully');
                            }
                        });
                    }
                });

            }
        });
    }
});

app.post('/', function (req, res) {
    if (req.body.isUser) {
        var query = {
            "$and": [
                { 'emailId': req.body.email },
                { 'password': req.body.password }
            ]
        };

        user_model.count(query, function (err, count) {
            if (err) {
                console.error(err);
                res.status(400).send(err);
            } else {
                if (count != 1) {
                    console.log('Login Failed');
                    res.status(401).send('Login Failed. Invalid username/password');
                } else {
                    console.log('login successful');
                    res.status(200).send('Login Successful');
                }
            }

        });
    } else {
        var query = {
            "$and": [
                { 'emailId': req.body.email },
                { 'password': req.body.password }
            ]
        };

        enterprise_model.count(query, function (err, count) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                if(count != 1){
                    console.log('Login Failed');
                    res.status(401).send('Login Failed. Invalid username/password');
                } else{
                    console.log('login successful');
                    res.status(200).send('Login Successful');
                }
            }
        });
    }
});

app.get('/*', function (req, res) {
    res.redirect('/' + account_type);
});

app.listen(config.dev.port, () => {
    console.log('Server running on locahost:' + config.dev.port);
});


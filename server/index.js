const express = require('express');
const path = require('path');
const config = require('./config/config');
const app = express();

var account_type = 'enterprise'; // TODO : get this from session

const account_route = require('./routes/' + account_type);
app.use('/' + account_type, account_route);

/*
app.get('/', function(req, res){
    res.redirect('/' + account_type);
});
*/

app.get('/*', function(req, res){
    res.redirect('/' + account_type);
});

app.listen(config.dev.port, () =>{
    console.log('Server running on locahost:' + config.dev.port);
});


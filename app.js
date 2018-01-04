var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var userRoutes = require('./routes/user');
var communityRoutes = require('./routes/community');
var messageRoutes = require('./routes/message');
var mongoose = require('mongoose');
//var index = require('./routes/index');
//var mongojs = require('mongojs');
//var db = mongojs("mongodb://localhost:27017/mean-example", ['UserInfo']);

var port = 3000;
var app = express();
mongoose.connect('localhost:27017/test-app');

app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '../client/client-app/dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

//app.set("mean-example", db);
//app.use('/', index); 
app.use("/user", userRoutes);
app.use("/community", communityRoutes);
app.use("/message", messageRoutes);
    
app.listen(port, function(){
    console.log('Server started on port '+port);
});
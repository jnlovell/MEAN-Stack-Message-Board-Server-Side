var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Community = require('../models/community');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



router.get('/:userId', function (req, res, next) {
    User.findById(req.params.userId, function(err, user){
        if(err){
            return res.status(401).json({
                title: "Could not get user",
                error: err
            });
        }
        res.status(200).json({
            message: "User found",
            obj: user
        });
    });
});

router.get('/getByCommunityId/:communityId', function(req, res, next){
    var communityId = req.params.communityId;
    Community.findById(communityId, function (err, community){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var members = community.members;
        console.log(members);
        User.find({"_id": { "$in": members} }, function(err, users){
            if(err){
                return res.status(404).json({
                    title: 'No users found',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Users Returned',
                obj: users
            });
        });
    });
})

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),   
        email: req.body.email,
    });

    user.save(function(err, user){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(201).json({
            message: 'User Created',
            token: token,
            userId: user._id,
            name: user.firstName
        });
    });
});


router.post('/signin', function(req, res, next){
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if(!user){
            return res.status(401).json({
                title: 'Login Failed',
                error: {message: 'Invlaid login credentials'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(401).json({
                title: 'Login Failed',
                error: {message: 'Invlaid login credentials'}
            });
        }
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: 'Successfully loggin in',
            token: token,
            userId: user._id,
            name: user.firstName
        });
    });
});

router.get('/checkEmail/:email', function (req, res, next) {
    var email = req.params.email;

    User.find({ email: email }).exec(function(err, result) {
        var exist = false;
        if(result.length > 0){
            exist = true;
        }
        res.send({ exists: exist });
    });
});

module.exports = router;
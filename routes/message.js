var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Community = require('../models/community');
var User = require('../models/user');
var Message = require('../models/message');

router.get('/:communityId', function(req, res, next){
    var communityId = req.params.communityId;
    Message.find({ community: communityId }).exec(function(err, messages){
        if (err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        res.status(200).json({
            message: 'Messages Returned',
            obj: messages
        });
    })
});

router.post('/', function(req, res, next){
    var communityId = req.body.community;
    var userId = req.body.user;
    var message = req.body.message;
    Community.findById(communityId, function(err, community){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        User.findById(userId, function(err, user){
            if(err){
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            var message1 = new Message({
                message: message,
                user: userId,
                community: communityId,
            });
            message1.save(function(err, result){
                if(err){
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'Saved message',
                    obj: result
                });
            });
        });
    });
});




module.exports = router;
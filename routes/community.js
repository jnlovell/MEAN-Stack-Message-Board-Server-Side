var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Community = require('../models/community');
var User = require('../models/user');

router.get('/', function(req, res, next) {
    Community.find(function(err, community){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        res.status(200).json({
            message: 'Communities Found',
            obj: community
        });
    })
})

router.get('/:id', function(req, res, next) {
    var communityId = req.params.id;
    Community.findById(communityId, function(err, community){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        res.status(200).json({
            message: 'Community Found',
            obj: community
        });
    })
})

router.post('/', function (req, res, next) {
    //var decoded = jwt.decode(req.query.token);

    /*var schema = new Schema({
        name: {type: String, required: true, unique: true},
        owner: {type: Schema.Types.ObjectId, ref:'User', required: true},
        topic: {type: String, required: true},
        public: {type: Boolean, required: true},
        members: [{type: Schema.Types.ObjectId, ref:'User'}]
    }); */
    var userId = req.body.owner;
    console.log(userId);
    User.findById(userId, function(err, user){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var community = new Community({
            name: req.body.name,
            owner: user._id,
            topic: req.body.topic,
            _public: req.body._public
        });
        community.save(function(err, result){
            if(err){
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            user.communities.push(result._id);
            user.save();
            community.members.push(user._id);
            community.save();
            res.status(201).json({
                message: 'Saved community',
                obj: result
            });
        });
    })
});

router.get('/getByUserId/:userId', function(req, res, next){
    var userId = req.params.userId;
    User.findById(userId, function(err, user){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        Community.find({ owner: userId }, function(err, communites){
            if(err){
                return res.status(401).json({
                    title: 'Could not get Communites',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Communities Found',
                obj: communites
            });
        });
    });
});

router.get('/addUser/:userId/:communityId', function (req, res, next){
    var userId = req.params.userId;
    var communityId = req.params.communityId;
    User.findById(userId, function(err, user){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        Community.findById(communityId, function(err, community){
            if(err){
                return res.status(401).json({
                    title: 'Could not get Communites',
                    error: err
                });
            }
                var checkUser = community.members.find(function(id){
                    return id == userId;
                });
                console.log(checkUser);
                if(checkUser == null){
                    user.communities.push(community._id);
                    user.save();
                    community.members.push(user._id);
                    community.save();
                    res.status(201).json({
                        message: 'User added to community',
                        obj: community
                    });
                }
                else{
                    res.status(404).json({
                        message: 'User already in community',
                        obj: community
                    });
                }
         
        });
    });
});

router.get('/removeUser/:userId/:communityId', function (req, res, next){
    var userId = req.params.userId;
    var communityId = req.params.communityId;
    User.findById(userId, function(err, user){
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        Community.findById(communityId, function(err, community){
            if(err){
                return res.status(500).json({
                    title: 'Could not get Communites',
                    error: err
                });
            }
            if(community.owner == userId){
                return res.status(400).json({
                    title: 'The given userId is the owner of this Community',
                    error: community
                });
            }
                
                var userIndex = community.members.indexOf(userId);
                var communityIndex = user.communities.indexOf(communityId);
                console.log(userIndex);
                if(userIndex !== -1 && communityIndex !== -1){
                    user.communities.splice(communityIndex, 1);
                    user.save();
                    community.members.splice(userIndex, 1);
                    community.save();
                    res.status(201).json({
                        message: 'User removed from community',
                        obj: community
                    });
                }
                else{
                    res.status(400).json({
                        message: 'User was not in community',
                        obj: community
                    });
                }
         
        });
    });
});

router.get('/checkName/:name', function (req, res, next) {
    var name = req.params.name;
    Community.find({ name: name }).exec(function(err, result) {
        var exist = false;
        if(result.length > 0){
            exist = true;
        }
        res.send({ exists: exist });
    });
});

module.exports = router;
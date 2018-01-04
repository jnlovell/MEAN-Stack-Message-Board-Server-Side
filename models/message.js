var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');
var Community = require('../models/community')

var schema = new Schema({
    message: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref:'User', required: true},
    community: {type: Schema.Types.ObjectId, ref:'Community', required: true}
});

module.exports = mongoose.model('Message', schema);
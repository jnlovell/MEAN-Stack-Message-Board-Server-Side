var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var User = require('../models/user');

var schema = new Schema({
    name: {type: String, required: true, unique: true},
    owner: {type: Schema.Types.ObjectId, ref:'User', required: true},
    topic: {type: String, required: true},
    _public: {type: Boolean, required: true},
    members: [{type: Schema.Types.ObjectId, ref:'User'}]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Community', schema);
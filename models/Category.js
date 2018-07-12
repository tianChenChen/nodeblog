var mongoose = require('mongoose');
var usersSchema =  require('../schemas/categories');

module.exports = mongoose.model('Category', usersSchema)
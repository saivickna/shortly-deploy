var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
// var config = require('./config');

var User = mongoose.model('User', db.users);
// User.pre('init', function(next, data) {
//   var cipher = Promise.promisify(bcrypt.hash);
//   cipher(data.password, null, null).bind(this)
//       .then(function(hash) {
//         data.password = hash;
//       });
//   next();
// });

module.exports = User;

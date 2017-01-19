var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');
// var config = require('../config');

var Link = mongoose.model('Link', db.links);
// Link.pre('init', function(next, data) {
//   var shasum = crypto.createHash('sha1');
//   shasum.update(data.url);
//   data.code = shasum.digest('hex').slice(0, 5);
//   next();
// });

module.exports = Link;

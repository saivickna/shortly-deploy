var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/test');

var Schema = mongoose.Schema;

var links = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
  timestamps: {type: Date, default: Date.now }
});

links.post('init', function(data) {
  var shasum = crypto.createHash('sha1');
  shasum.update(data.url);
  data.code = shasum.digest('hex').slice(0, 5);
  this.save();
  //next();
});

links.post('validate', function(data) {
  var shasum = crypto.createHash('sha1');
  shasum.update(data.url);
  data.code = shasum.digest('hex').slice(0, 5);

  //next();
});

var users = new Schema({
  username: String,
  password: String,
  timestamps: {type: Date, default: Date.now}
});

users.post('init', function(data) {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(data.password, null, null).bind(this)
      .then(function(hash) {
        data.password = hash;
      });
  //next();
});

module.exports.links = links;
module.exports.users = users;

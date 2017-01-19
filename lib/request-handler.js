var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
  Link.find({}, 'url baseUrl code title visits', function (err, links) {
    if (!err) {
      res.status(200).send(links);
    }
  });

};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({'url': uri}, 'url', function(err, url) {
    if (!err && url) {
      res.status(200).send(url);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        console.log(uri);
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save(function (err) {
          if (err) {
            return res.sendStatus(404);
          } else {
            res.status(200).send(newLink);
          }
        });
      });
    }
  });
};


//////////////


exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username': username}, 'password', function(err, user) {
    if (err || !user) {
      res.redirect('/login');
    } else {
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (isMatch) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username': username}, 'username', function (err, user) {
    if (!err && !user) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function (err) {
        if (err) {
          res.redirect('/signup');
        } else {
          util.createSession(req, res, newUser);
        }
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });

};

exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0]}, 'url visits', function(err, link) {
    if (err || !link) {
      res.redirect('/');
    } else {
      link.visits += 1;
      link.save(function(err) {
        if (!err) {
          res.redirect(link.url);
        }
      });

    }
  });
};
var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var bcrypt = require('bcrypt');
var helpers = require('../lib/helpers');
var passport = require('../lib/passport');

router.get('/', function(req, res, next) {
  if (req.user) {
    var name = req.user.displayName || '';
    res.render('index', { title: 'Hello ' + name });
  } else {
    res.render('index', {title: 'Express'});
  }

});

router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback', passport.authenticate('linkedin', {failureRedirect: '/'}),
 function(req, res, next) {
   console.log('user:', req.user);
   res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;

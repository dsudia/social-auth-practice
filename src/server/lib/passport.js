var passport = require('passport');
var LocalStrategy = require('passport-local');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var knex = require('../../../db/knex');
var helpers = require('./helpers');


passport.use(new LocalStrategy({
},
  function(username, password, done) {
    knex('users').where('username', username)
      .then(function(data) {
        var user = data[0];
        if (password === user.password) {
          return done(null, user, {message: 'You\'re logged in!'});
        } else {
          return done(null, false, {message: 'Incorrect password.'});
        }
    }).catch(function(err) {
      return done(null, false, {message: 'Incorrect username.'});
    });
  }
));

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_API_KEY,
  clientSecret: process.env.LINKEDIN_SECRET_KEY,
  callbackURL: 'http://localhost:3000/linkedin/callback',
  state: true,
  scope: ['r_emailaddress', 'r_basicprofile']
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
}));

// *** configure passport *** //
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;

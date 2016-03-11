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
    var id = profile.id;
    var firstName = profile.name.givenName;
    var lastName = profile.name.familyName;
    var email = profile.emails[0].value;
    var photo = profile.photos[0].value;
    knex('users').where('linkedin_id', id)
      .then(function (user) {
        if (user[0] === undefined) {
          return knex('users').insert({linkedin_id: id, email: email, preferred_name: firstName, last_name: lastName, avatar_url: photo})
          .then(function() {
            return knex('users').select('*').where('linkedin_id', id)
            .then(function(user) {
              return user[0].id;
            });
          });
        }
        else {
          return user[0].id;
        }
      }).then(function (userID) {
        return done(null, userID);
      });
}));

// *** configure passport *** //
passport.serializeUser(function(userID, done) {
  done(null, userID);
});

passport.deserializeUser(function(userID, done) {
  done(null, userID);
});

module.exports = passport;

// Include modules 
const passport = require('passport')
const mongoose = require('mongoose')
const LocalStorage = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

// Include models
const User = require('../models/user')

module.exports = passport => {
  // Configure strategy using use() function
  passport.use(new LocalStorage({
    // ask LocalStrategy to find username in parameter named email
    usernameField: 'email',
    // also pass req to verify callback
    passReqToCallback: true
  },
    // set up a verify call back to accept credentials
    function (req, username, password, done) {
      User.findOne({ email: username }, (err, user) => {
        if (err) { return done(err) }
        // no such user
        if (!user) { return done(null, false, req.flash('error', 'Email 輸入錯誤')) }
        // has such user, but with incorrect password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          // password correct
          if (isMatch) { return done(null, user) }
          // password incorrect
          return done(null, false, req.flash('error', '密碼輸入錯誤'))
        })
      })
    }
  ))

  // Configure 
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile._json.email })
        .then(user => {
          if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(randomPassword, salt, (err, hash) => {
                const newUser = new User({
                  name: profile._json.name,
                  email: profile._json.email,
                  password: hash
                })
                newUser.save()
                  .then(user => done(null, user))
                  .catch(err => console.log(err))
              })
            })
          } else {
            // if user exist
            return done(null, user)
          }
        })
    }
  ))

  // Serialize user instance to the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // Deserialize user instance from the session
  passport.deserializeUser((id, done) => {
    // id from the session is used to find the user, and be stored to req.user
    User.findById(id, (err, user) => [
      done(err, user)
    ])
  })
}
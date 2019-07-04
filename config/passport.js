// Include modules 
const passport = require('passport')
const mongoose = require('mongoose')
const LocalStorage = require('passport-local').Strategy

// Include models
const User = require('../models/user')

module.exports = passport => {
  // Configure strategy using use() function
  passport.use(new LocalStorage({
    // ask LocalStrategy to find username in parameter named email
    usernameField: 'email'
  },
    // set up a verify call back to accept credentials
    function (username, password, done) {
      User.findOne({ email: username }, (err, user) => {
        if (err) { return done(err) }
        // no such user
        if (!user) { return done(null, false, { message: 'Email 輸入錯誤' }) }
        // has such user, but with incorrect password
        if (user.password !== password) { return done(null, false, { message: '密碼錯誤' }) }
        // has such user and passed authentication, supply Passport with user
        return done(null, user)
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
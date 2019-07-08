const express = require('express')
const router = express.Router()
const passport = require('passport')

// facebook login
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))

// facebook login callback
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router
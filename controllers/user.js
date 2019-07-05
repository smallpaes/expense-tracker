// Include modules
const User = require('../models/user')
const { validationResult } = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')
// Nodejs built-it crypto to help create unique random value for token
const crypto = require('crypto')

module.exports = {
  getRegister: (req, res) => {
    res.render('register', {
      formCSS: true,
      formValidateJS: true
    })
  },
  postRegister: (req, res) => {
    // get user input
    const { name, email, password, rePassword } = req.body
    // get all validation error message in an object
    const errors = validationResult(req)
    // if any error message prompted, show warning message
    if (!errors.isEmpty()) {
      return res.status(422).render('register', {
        formCSS: true,
        formValidateJS: true,
        errorMessages: errors.array(),
        user: { name, email, password, rePassword }
      })
    }
    // Check if this is an existing email, after passing validation
    User.findOne({ email: email })
      .then(user => {
        // an existing email
        if (user) {
          req.flash('reminder', '帳號已註冊過，請直接登入')
          return res.redirect('/users/login')
        }
        // new user email
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) { return console.log(err) }
            // store user into database
            User.create({
              name: name,
              email: email,
              password: hash
            })
              .then(user => {
                res.redirect('/')
              })
              .catch(err => console.log(err))
          })
        })
      })
      .catch(err => console.log(err))
  },
  getLogin: (req, res) => {
    res.render('login', {
      formCSS: true,
      formValidateJS: true
    })
  },
  getLogout: (req, res) => {
    // remove req.user property and clear login session
    req.logout()
    // show logout success message
    req.flash('success', '你己經成功登出')
    // redirect back to login page
    res.redirect('/users/login')
  },
  getReset: (req, res) => {
    res.render('reset', {
      formCSS: true,
      formValidateJS: true,
    })
  },
  postRest: (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err)
        return res.redirect('/')
      }
      const token = buffer.toString('hex')
      // store token on the user planning to reset
      User.findOne({ email: req.body.email })
        .then(user => {
          // no user found
          if (!user) {
            req.flash('error', '此 Email 未註冊過')
            return res.redirect('/users/reset')
          }
          // user is found, add token
          user.resetToken = token
          // token expired in an hour
          user.resetTokenExpiration = Date.now() + 3600000
          // save info to database
          user.save()
        })
        .catch(err => console.log(err))
    })
  }
}
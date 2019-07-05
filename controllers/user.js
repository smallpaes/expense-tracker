// Include modules
const User = require('../models/user')
const { validationResult } = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')

module.exports = {
  getRegister: (req, res) => {
    res.render('user', {
      formCSS: true,
      formValidateJS: true,
      registerMode: true
    })
  },
  postRegister: (req, res) => {
    // get user input
    const { name, email, password, rePassword } = req.body
    // get all validation error message in an object
    const errors = validationResult(req)
    // if any error message prompted, show warning message
    if (!errors.isEmpty()) {
      return res.status(422).render('user', {
        formCSS: true,
        formValidateJS: true,
        registerMode: true,
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
    res.render('user', {
      formCSS: true,
      formValidateJS: true,
      registerMode: false
    })
  },
  getLogout: (req, res) => {
    // remove req.user property and clear login session
    req.logout()
    // show logout success message
    req.flash('success', '你己經成功登出')
    // redirect back to login page
    res.redirect('/users/login')
  }
}
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// signup page
router.get('/register', (req, res) => {
  res.render('user', {
    formCSS: true,
    formValidateJS: true,
    registerMode: true
  })
})

// signup submit page
router.post('/register', [
  // name is required
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('名字必填，且不能是空格'),
  // email is requires and follow email format
  body('email')
    .trim()
    .isEmail()
    .withMessage('電子信箱必填，格式須為：xx@xx.xx'),
  // password is required
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('密碼必填'),
  // re-password is required and should match the first input
  body('rePassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('兩次輸入的密碼不相同')
      }
      return true
    })
], (req, res) => {
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
})

// login page
router.get('/login', (req, res) => {
  res.render('user', {
    formCSS: true,
    formValidateJS: true,
    registerMode: false
  })
})

// login submit page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// logout page
router.get('/logout', (req, res) => {
  // remove req.user property and clear login session
  req.logout()
  // show logout success message
  req.flash('success', '你己經成功登出')
  // redirect back to login page
  res.redirect('/users/login')
})


module.exports = router


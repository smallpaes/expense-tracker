const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { body, validationResult } = require('express-validator')

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
  // if data pass front-end & back-end validation
  User.create({
    name: name,
    email: email,
    password: password
  })
    .then(user => {
      res.redirect('/')
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
router.post('/login', (req, res) => {
  res.send('login submit page')
})

// logout page
router.get('/logout', (req, res) => {
  res.send('logout page')
})


module.exports = router


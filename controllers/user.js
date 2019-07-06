// Include modules
const User = require('../models/user')
const { validationResult } = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')
// Nodejs built-it crypto to help create unique random value for token
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

// set up transporter to tell nodemailer how email will be delivered
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_KEY
  }
}))

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
                res.redirect('/users/login')
                return transporter.sendMail({
                  to: email,
                  from: 'expense-tracker@example.com',
                  subject: '註冊成功',
                  html: `
                    <p>${name}, 你已經註冊成功</p>
                    <a href="http://localhost:3000/">點我前往家庭記帳本</a>
                  `
                })
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
            .then(user => {
              // redirect back to login page
              res.redirect('/users/login')
              // send a reset email to user with unique token as params
              transporter.sendMail({
                to: req.body.email,
                from: 'expense-tracker@example.com',
                subject: '重設密碼',
                html: `
                  <p>${user.name} 您好,</p>
                  <p>點擊<a href="http://localhost:3000/users/reset/${token}">此連結</a>重設密碼</p>
                `
              })
            })
        })
        .catch(err => console.log(err))
    })
  },
  getNewPassword: (req, res) => {
    // get token embed in the URL
    const token = req.params.token
    // find the user in the database
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
        res.render('new-password', {
          formCSS: true,
          formValidateJS: true,
          userId: user._id,
          passwordToken: token
        })
      })
      .catch(err => console.log(err))
  },
  postNewPassword: (req, res) => {
    const { password, userId, passwordToken } = req.body
    // get all validation error message in an object
    const errors = validationResult(req)
    // if any error message prompted, show warning message
    if (!errors.isEmpty()) {
      return res.status(422).render('new-password', {
        formCSS: true,
        formValidateJS: true,
        userId: user._id,
        passwordToken: token
      })
    }
    // form passed validation
    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
      .then(user => {
        // hash new password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) console.log(err)
            user.password = hash
            user.resetToken = null
            user.resetTokenExpiration = null
            user.save()
              .then(res.redirect('/users/login'))
          })
        })
      })
      .catch(err => console.log(err))
  }
}
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
    // hide secret key
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
  postRegister: async (req, res) => {
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

    try {
      // Check if this is an existing email, after passing validation
      const user = await User.findOne({ email: email })
      // an existing email
      if (user) {
        req.flash('reminder', '帳號已註冊過，請直接登入')
        return res.redirect('/users/login')
      }

      // new user email
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      // store user into database
      await User.create({
        name: name,
        email: email,
        password: hash
      })

      // redirect back to login page after successful signup
      res.redirect('/users/login')
      // check if it is currently on deploy mode 
      const link = process.env.PORT ? "https://boiling-beach-19178.herokuapp.com/" : "http://localhost:3000/"
      // send successful sign up email
      await transporter.sendMail({
        to: email,
        from: 'expense-tracker@example.com',
        subject: '註冊成功',
        html: `
          <p>${name}, 你已經註冊成功</p>
          <a href=${link}>點我前往家庭記帳本</a>
        `
      })
    } catch (err) {
      res.redirect('/users/register')
      console.log(err)
    }
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
  postRest: async (req, res) => {
    try {
      // generate random token
      const buffer = await crypto.randomBytes(32)
      const token = buffer.toString('hex')

      // store token on the user planning to reset
      const user = await User.findOne({ email: req.body.email })

      // no user found
      if (!user) {
        req.flash('error', '此 Email 未註冊過')
        return res.redirect('/users/reset')
      }

      // user is found, add token
      user.resetToken = token
      // token expired in an hour
      user.resetTokenExpiration = Date.now() + 3600000
      // save token and expiration time
      await user.save()
      // redirect back to login page
      res.redirect('/users/login')
      // check if it is currently on deploy mode 
      const link = process.env.PORT ? `https://boiling-beach-19178.herokuapp.com/users/reset/${token}` : `http://localhost:3000/users/reset/${token}`
      // send a reset email to user with unique token as params
      transporter.sendMail({
        to: req.body.email,
        from: 'expense-tracker@example.com',
        subject: '重設密碼',
        html: `
          <p>${user.name} 您好,</p>
          <p>點擊<a href=${link}>此連結</a>重設密碼</p>
        `
      })
    } catch (err) {
      res.redirect('/users/reset')
      console.log(err)
    }
  },
  getNewPassword: async (req, res) => {
    // get token embed in the URL
    const token = req.params.token

    try {
      // find the user in the database
      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      // render to new password set up page
      res.render('new-password', {
        formCSS: true,
        formValidateJS: true,
        userId: user._id,
        passwordToken: token
      })
    } catch (err) {
      res.redirect('/users/reset')
      console.log(err)
    }
  },
  postNewPassword: async (req, res) => {
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
    try {
      // find user 
      const user = await User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
      // hash new password
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      // update password and clear token related data
      user.password = hash
      user.resetToken = null
      user.resetTokenExpiration = null
      await user.save()
      // redirect back to login page
      res.redirect('/users/login')

    } catch (err) {
      res.redirect('/users/reset')
      console.log(err)
    }
  }
}
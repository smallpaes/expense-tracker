const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const passport = require('passport')

// Include controller
const userController = require('../controllers/user')

// signup page
router.get('/register', userController.getRegister)

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
    .custom((value) => {
      const regex = /^\S{8,12}$/
      if (!value.match(regex)) {
        throw new Error('密碼是 8-12 位不含空白的數字、符號、英文字母')
      }
      return true
    }),
  // re-password is required and should match the first input
  body('rePassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('兩次輸入的密碼不相同')
      }
      return true
    })
], userController.postRegister)

// login page
router.get('/login', userController.getLogin)

// login submit page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// logout page
router.get('/logout', userController.getLogout)

// reset password page: send email
router.get('/reset', userController.getReset)

// reset password submit: send email
router.post('/reset', userController.postRest)

// reset password page: from email link
router.get('/reset/:token', userController.getNewPassword)

// reset password submit: from email link
router.post('/new-password', [
  // password is required
  body('password')
    .custom((value) => {
      const regex = /^\S{8,12}$/
      if (!value.match(regex)) {
        throw new Error('密碼是 8-12 位不含空白的數字、符號、英文字母')
      }
      return true
    }),
  // re-password is required and should match the first input
  body('rePassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('兩次輸入的密碼不相同')
      }
      return true
    })
], userController.postNewPassword)

module.exports = router


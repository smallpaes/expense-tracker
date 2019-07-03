const express = require('express')
const router = express.Router()

// signup page
router.get('/register', (req, res) => {
  res.render('user', {
    formCSS: true,
    formValidateJS: true,
    registerMode: true
  })
})

// signup submit page
router.post('/register', (req, res) => {
  res.send('signup submit page')
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


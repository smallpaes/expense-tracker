const express = require('express')
const router = express.Router()
// Include authentication middleware
const isAuthenticated = require('../config/auth')

// Include models
const Record = require('../models/record')
const User = require('../models/user')


router.get('/', isAuthenticated, (req, res) => {
  console.log(req.user)
  // retrieve all expense from record collection
  Record.find({})
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)
      // find total expense
      const totalAmount = records.reduce((acc, cur) => acc + cur.amount, 0)
      // find total month
      const months = []
      records.forEach(record => {
        if (months.includes(record.date.slice(0, 7))) { return }
        months.push(record.date.slice(0, 7))
      })
      res.render('index', { indexCSS: true, records, totalAmount, months })
    })
})

module.exports = router
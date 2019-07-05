const express = require('express')
const router = express.Router()
// Include authentication middleware
const isAuthenticated = require('../config/auth')
const Record = require('../models/record')

router.get('/', isAuthenticated, (req, res) => {

  const { month, category, defaultCategory, defaultMonth } = req.query
  const selectedMonth = month ? month
    : defaultMonth ? defaultMonth
      : null
  const selectedCategory = category ? category
    : defaultCategory ? defaultCategory
      : null
  const categoryCriteria = selectedCategory ? { category: selectedCategory } : {}
  const dateCriteria = selectedMonth ? { date: { $regex: selectedMonth, $options: 'i' } } : {}
  const months = []

  // find all record
  Record.find({ userId: req.user._id }, null, { sort: { date: 'desc' } })
    .then(records => {
      // find total month
      records.forEach(record => {
        if (months.includes(record.date.slice(0, 7))) { return }
        months.push(record.date.slice(0, 7))
      })
      return Record.find({
        $and: [
          categoryCriteria,
          dateCriteria,
          { userId: req.user._id }
        ]
      })
        .sort({ date: 'desc' })
    })
    .then(records => {
      // find total expense
      const totalAmount = records.reduce((acc, cur) => acc + cur.amount, 0)
      res.render('index', { indexCSS: true, records, totalAmount, selectedCategory, selectedMonth, months })
    })
})

module.exports = router
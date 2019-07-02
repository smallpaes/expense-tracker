const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Record = require('../models/record')

// Create new expense page
router.get('/new', (req, res) => {
  res.render('form', { formCSS: true })
})

// Create new expanse submit
router.post('/new', (req, res) => {
  console.log(req.body)

  // retrieve input data
  const { name, date, category, amount } = req.body

  //create new document in record collection
  const newRecord = new Record({
    name: name,
    category: category,
    date: date,
    amount: amount
  })

  // save the document to record collection
  newRecord.save((err, expense) => {
    if (err) return console.log(err)
    res.redirect('/')
  })
})

// Edit expense page
router.get('/edit/:id', (req, res) => {
  res.send('edit expense page')
})

// Edit expense submit
router.post('/edit/:id', (req, res) => {
  res.send('submit edited expense page')
})

// Delete expense 
router.delete('/delete/:id', (req, res) => {
  res.send('delete expense')
})


module.exports = router
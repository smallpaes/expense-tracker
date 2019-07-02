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
  // find the document based on id 
  Record.findById(req.params.id)
    .then(record => {
      res.render('form', { formCSS: true, record })
    })
    .catch(err => console.log(err))

})

// Edit expense submit
router.put('/edit/:id', (req, res) => {
  // get all data from data input
  const { name, date, category, amount } = req.body
  // find the document based on id
  Record.findById(req.params.id)
    .then(record => {
      console.log(record)
      // update document info based on form input
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount

      // save the document to database
      record.save()
        .then(record => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// Delete expense 
router.delete('/delete/:id', (req, res) => {
  res.send('delete expense')
})


module.exports = router
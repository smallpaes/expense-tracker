// Include modules
const Record = require('../models/record')
const { validationResult } = require('express-validator')

module.exports = {
  getNewExpense: (req, res) => {
    console.log(req.user)
    res.render('form', { formCSS: true, formValidateJS: true })
  },
  postNewExpense: (req, res) => {
    // retrieve input data
    const { name, date, category, amount } = req.body
    // Find all validation errors in the req in a object
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).render('form', {
        formCSS: true,
        record: { name, date, category, amount },
        formValidateJS: true,
        errorMessages: errors.array()
      })
    }
    // form passed validation: create new document in record collection
    const newRecord = new Record({
      name: name,
      category: category,
      date: date,
      amount: amount,
      userId: req.user._id
    })

    // save the document to record collection
    newRecord.save((err, expense) => {
      if (err) return console.log(err)
      res.redirect('/')
    })
  },
  getEditExpense: (req, res) => {
    // find the document based on id 
    Record.findOne({ _id: req.params.id, userId: req.user._id })
      .then(record => {
        res.render('form', { formCSS: true, record, formValidateJS: true, isEditMode: true })
      })
      .catch(err => console.log(err))
  },
  postEditExpense: (req, res) => {
    // get all data from data input
    const { name, date, category, amount } = req.body
    // Find all validation errors in the req in a object
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).render('form', {
        formCSS: true,
        record: { name, date, category, amount, _id: req.params.id },
        formValidateJS: true,
        isEditMode: true,
        errorMessages: errors.array()
      })
    }
    // find the document based on id
    Record.findOne({ _id: req.params.id, userId: req.user._id })
      .then(record => {
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
  },
  deleteExpense: (req, res) => {
    // find the document based on id
    Record.findOne({ _id: req.params.id, userId: req.user._id })
      .then(record => {
        record.remove((err, record) => {
          if (err) return console.log(err)
          res.redirect('/')
        })
      })
      .catch(err => console.log(err))
  }
}
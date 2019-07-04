const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Record = require('../models/record')
// Include check package from express-validator
const { body, validationResult } = require('express-validator')
// Include authentication middleware
const isAuthenticated = require('../config/auth')

// Create new expense page
router.get('/new', isAuthenticated, (req, res) => {
  console.log(req.user)
  res.render('form', { formCSS: true, formValidateJS: true })
})

// Create new expanse submit
router.post('/new', isAuthenticated, [
  // name is requires
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('名字必填，且不能是空格'),
  // date is require is in date format
  body('date')
    .custom(value => {
      const regex = /^\d{4}-\d{2}-\d{2}$/
      if (!value.match(regex)) {
        throw new Error('輸入的日期格式錯誤')
      }
      // return true if input pass the validation
      return true
    }),
  body('category')
    .custom(value => {
      if (!['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他'].includes(value)) {
        throw new Error('請選擇一個類別')
      }
      return true
    }),
  // amount is required, and should be a positive integer
  body('amount')
    .trim()
    .isInt({ min: 1 })
    .withMessage('必填一個大於零的金額')
], (req, res) => {
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
router.get('/edit/:id', isAuthenticated, (req, res) => {
  // find the document based on id 
  Record.findById(req.params.id)
    .then(record => {
      res.render('form', { formCSS: true, record, formValidateJS: true, isEditMode: true })
    })
    .catch(err => console.log(err))

})

// Edit expense submit
router.put('/edit/:id', isAuthenticated, [
  // name is requires
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('名字必填，且不能是空格'),
  // date is require is in date format
  body('date')
    .custom(value => {
      const regex = /^\d{4}-\d{2}-\d{2}$/
      if (!value.match(regex)) {
        throw new Error('輸入的日期格式錯誤')
      }
      // return true if input pass the validation
      return true
    }),
  body('category')
    .custom(value => {
      if (!['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他'].includes(value)) {
        throw new Error('請選擇一個類別')
      }
      return true
    }),
  // amount is required, and should be a positive integer
  body('amount')
    .trim()
    .isInt({ min: 1 })
    .withMessage('必填一個大於零的金額')
], (req, res) => {
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
  Record.findById(req.params.id)
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
})

// Delete expense 
router.delete('/delete/:id', isAuthenticated, (req, res) => {
  // find the document based on id
  Record.findById(req.params.id)
    .then(record => {
      record.remove((err, record) => {
        if (err) return console.log(err)
        res.redirect('/')
      })
    })
    .catch(err => console.log(err))
})


module.exports = router
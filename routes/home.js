const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const User = require('../models/user')

router.get('/', (req, res) => {
  // retrieve all expense from record collection
  Record.find()
    .then(records => {
      console.log(records[0]._id)
      res.render('index', { indexCSS: true, records })
    })
    .catch(err => console.log(err))
})

module.exports = router
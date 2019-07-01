const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const filter = req.query
  console.log(filter)
  res.render('index')
})

module.exports = router
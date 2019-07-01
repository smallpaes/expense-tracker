const express = require('express')
const router = express.Router()

// Create new expense page
router.get('/new', (req, res) => {
  res.send('new expense page')
})

// Create new expanse submit
router.post('/new', (req, res) => {
  res.send('submit new expense page')
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
// Include modules
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Set up server related variable
const port = 3000

// connect to MongoDB, it will return a Connection object
mongoose.connect('mongodb://127.0.0.1/expense-tracker', {
  useNewUrlParser: true, useCreateIndex: true
})

const db = mongoose.connection

// connection error
db.on('error', () => {
  console.log('mongodb error!')
})

// connection seccess
db.once('open', () => {
  console.log('mongodb connected!')
})

// Include Models
const User = require('./models/user')
const Record = require('./models/record')

app.get('/', (req, res) => {
  res.send('landing page')
})

// Start and listen to server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
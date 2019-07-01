// Include modules
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

// Set up express-handlebars
app.engine('handlebars', exphbs({ default: 'main' }))
app.set('view engine', 'handlebars')

// Include routers
const homeRoutes = require('./routes/home')
const expenseRoutes = require('./routes/expense')
const userRoutes = require('./routes/user')

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

// connection success
db.once('open', () => {
  console.log('mongodb connected!')
})

// Include Models
const User = require('./models/user')
const Record = require('./models/record')

// home route
app.use('/', homeRoutes)

// expense routes
app.use('/expenses', expenseRoutes)

// user routes
app.use('/users', userRoutes)

// error page
app.use((req, res) => {
  res.send('page not found')
})

// Start and listen to server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
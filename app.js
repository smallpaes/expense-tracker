// Include modules
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const handlebarHelpers = require('./handlebars-helpers')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

// Set up express-handlebars
app.engine('handlebars', exphbs({ default: 'main' }))
app.set('view engine', 'handlebars')

// Include routers
const homeRoutes = require('./routes/home')
const expenseRoutes = require('./routes/expense')
const userRoutes = require('./routes/user')
const searchRoutes = require('./routes/search')

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

// add middle-parser middleware
app.use(bodyParser.urlencoded({ extended: true }))

// set up session
app.use(session({
  secret: 'joifhjoweifoikwenfokerjnofmweakmndlew',
  resave: false,
  saveUninitialized: false
}))

// Initialize Passport
app.use(passport.initialize())

// use persistent login sessions
app.use(passport.session())

// include passport config
require('./config/passport')(passport)

// use method-override to override using a query value
app.use(methodOverride('_method'))

// serve static files
app.use(express.static('public'))

// home route
app.use('/', homeRoutes)

// expense routes
app.use('/expenses', expenseRoutes)

// search routes
app.use('/search', searchRoutes)

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
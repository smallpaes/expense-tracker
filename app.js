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
const flash = require('connect-flash')
const csrf = require('csurf')
// check if it's in production mode
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

// Initialize csrf protection middleware
const csrfProtection = csrf()

// Include controllers
const errorController = require('./controllers/error')

// Set up express-handlebars
app.engine('handlebars', exphbs({ default: 'main' }))
app.set('view engine', 'handlebars')

// Include routers
const homeRoutes = require('./routes/home')
const expenseRoutes = require('./routes/expense')
const userRoutes = require('./routes/user')
const searchRoutes = require('./routes/search')
const authRoutes = require('./routes/auths')

// Set up server related variable
const port = 3000

// connect to MongoDB, it will return a Connection object
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/expense-tracker', {
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

// use csrf protection middleware after session
app.use(csrfProtection)

// use flash middleware
app.use(flash())

// Initialize Passport
app.use(passport.initialize())

// use persistent login sessions
app.use(passport.session())

// include passport config
require('./config/passport')(passport)

// Set response local level variables to use in views during that cycle
app.use((req, res, next) => {
  // safe user info 
  res.locals.user = req.user
  // reminder message
  res.locals.reminder = req.flash('reminder')
  // error message
  res.locals.error = req.flash('error')
  // success message
  res.locals.success = req.flash('success')
  // generate one CSRF token to each render page
  res.locals.csrfToken = req.csrfToken()
  next()
})

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

// auth routes
app.use('/auth', authRoutes)

// error page
app.use(errorController.getError)

// Start and listen to server
app.listen(process.env.PORT || port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
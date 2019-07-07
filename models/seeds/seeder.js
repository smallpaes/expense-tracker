// Include modules
const mongoose = require('mongoose')
const User = require('../user')
const Record = require('../record')
const bcrypt = require('bcryptjs')

// Include json files
const { users: userList } = require('../../user.json')
const { records: recordList } = require('../../record.json')

// connect to mondoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/expense-tracker', {
  useNewUrlParser: true, useCreateIndex: true
})

const db = mongoose.connection

// connection failed
db.on('error', () => { console.log('db error!') })

// connection success
db.once('open', () => {
  console.log('db connected!')
  userList.forEach((user, index) => {
    // get hashed password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) { return console.log(err) }
        // create new user document
        const newUser = new User({
          name: user.name,
          email: user.email,
          password: hash
        })
        // save userList to users collection
        newUser.save()
          .then(user => {
            const records = index ? recordList.slice(6, 12) : recordList.slice(0, 6)
            records.forEach(record => {
              Record.create({
                name: record.name,
                category: record.category,
                date: record.date,
                amount: record.amount,
                userId: user._id
              })
            })
          })
      })
    })
  })
  console.log('User and record seeds are created')
})

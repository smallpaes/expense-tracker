// Include models
const Record = require('../models/record')

module.exports = {
  getHome: (req, res) => {
    // retrieve all expense from record collection
    Record.find({ userId: req.user._id })
      .sort({ date: 'desc' })
      .exec((err, records) => {
        if (err) return console.log(err)
        // find total expense
        const totalAmount = records.reduce((acc, cur) => acc + cur.amount, 0)
        // find total month
        const months = []
        records.forEach(record => {
          if (months.includes(record.date.slice(0, 7))) { return }
          months.push(record.date.slice(0, 7))
        })
        res.render('index', { indexCSS: true, records, totalAmount, months })
      })
  }
}
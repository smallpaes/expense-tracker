// Include models
const Record = require('../models/record')
const { getFormatedMonth } = require('../date-process')

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
          const displayDate = getFormatedMonth(record)
          if (months.includes(displayDate)) { return }
          months.push(displayDate)
        })
        res.render('index', { indexCSS: true, records, totalAmount, months })
      })
  }
}
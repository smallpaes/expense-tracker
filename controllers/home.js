// Include models
const Record = require('../models/record')
const { getFormatedMonth, getChartData } = require('../date-process')

module.exports = {
  getHome: async (req, res) => {
    try {
      // retrieve all expense from record collection
      const records = await Record.find({ userId: req.user._id })
        .sort({ data: 'desc' })
        .exec()

      // find total expense
      const totalAmount = records.reduce((acc, cur) => acc + cur.amount, 0)
      // get chart data
      const chartData = getChartData(records)
      // check if any record is found
      const isEmptyRecord = records.length ? false : true
      // find total month
      const months = []
      records.forEach(record => {
        const displayDate = getFormatedMonth(record)
        if (months.includes(displayDate)) { return }
        months.push(displayDate)
      })
      res.render('index', { indexCSS: true, records, totalAmount, months, chartData, showChart: true, isEmptyRecord })
    } catch (err) {
      return console.log(err)
    }
  }
}
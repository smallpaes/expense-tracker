// Include models
const Record = require('../models/record')
const { getDateCriteria, getFormatedMonth, getChartData } = require('../date-process')

module.exports = {
  getSearchExpense: (req, res) => {
    // keep filtered options
    const { month, category, defaultCategory, defaultMonth } = req.query
    const selectedMonth = month ? month
      : defaultMonth ? defaultMonth
        : null
    const selectedCategory = category ? category
      : defaultCategory ? defaultCategory
        : null
    const categoryCriteria = selectedCategory ? { category: selectedCategory } : {}
    const dateCriteria = getDateCriteria(selectedMonth)
    const months = []

    // find all record
    Record.find({ userId: req.user._id }, null, { sort: { date: 'desc' } })
      .then(records => {
        // find month options for filter
        records.forEach(record => {
          const displayDate = getFormatedMonth(record)
          if (months.includes(displayDate)) { return }
          months.push(displayDate)
        })
        return Record.find({
          $and: [
            dateCriteria,
            categoryCriteria,
            { userId: req.user._id }
          ]
        })
          .sort({ date: 'desc' })
      })
      .then(records => {
        // check if any record is found
        const isEmptyRecord = records.length ? false : true
        // find total expense
        const totalAmount = records.reduce((acc, cur) => acc + cur.amount, 0)
        // get chart data
        const chartData = getChartData(records)
        res.render('index', { indexCSS: true, records, totalAmount, selectedCategory, selectedMonth, months, chartData, showChart: true, isEmptyRecord })
      })
  }
}
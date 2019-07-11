// Include models
const Record = require('../models/record')
const { getDateCriteria, getFormatedMonth, getChartData } = require('../date-process')

module.exports = {
  getSearchExpense: async (req, res) => {
    // keep filtered options
    const { month, category, defaultCategory, defaultMonth, monthReset, categoryReset } = req.query
    const selectedMonth = (monthReset || (!month && !defaultMonth)) ? null
      : month ? month : defaultMonth

    const selectedCategory = (categoryReset || (!category && !defaultCategory)) ? null
      : category ? category : defaultCategory

    const categoryCriteria = selectedCategory ? { category: selectedCategory } : {}
    const dateCriteria = getDateCriteria(selectedMonth)
    const months = []

    try {
      // find all records
      const allRecords = await Record.find({ userId: req.user._id }, null, { sort: { date: 'desc' } })

      // get month options for filter
      allRecords.forEach(record => {
        const displayDate = getFormatedMonth(record, false)
        if (months.includes(displayDate)) { return }
        months.push(displayDate)
      })

      // find matching records
      const displayRecords = await Record.find({
        $and: [
          dateCriteria,
          categoryCriteria,
          { userId: req.user._id }
        ]
      })
        .sort({ date: 'desc' })

      // check if any record is found
      const isEmptyRecord = displayRecords.length ? false : true
      // find total expense
      const totalAmount = displayRecords.reduce((acc, cur) => acc + cur.amount, 0)
      // get chart data
      const chartData = getChartData(displayRecords)
      res.render('index', { indexCSS: true, records: displayRecords, totalAmount, selectedCategory, selectedMonth, months, chartData, showChart: true, isEmptyRecord })
    } catch (err) {
      console.log(err)
    }
  }
}
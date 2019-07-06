module.exports = {
  getDateCriteria: selectedMonth => {
    if (!selectedMonth) { return {} }

    // get next month
    let nextMonth = new Date(selectedMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return { date: { $gte: new Date(selectedMonth), $lte: nextMonth } }
  },
  getFormatedMonth: record => {
    let date = new Date(record.date)
    date = date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'numeric' })
    return `${date.split('/')[1]}/${date.split('/')[0]}`
  }
}
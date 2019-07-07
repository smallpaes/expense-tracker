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
  },
  getChartData: records => {
    const chartData = [0, 0, 0, 0, 0]
    records.forEach(record => {
      record.category === '家居物業' ? chartData[0] += record.amount
        : record.category === '交通出行' ? chartData[1] += record.amount
          : record.category === '休閒娛樂' ? chartData[2] += record.amount
            : record.category === '餐飲食品' ? chartData[3] += record.amount
              : chartData[4] += record.amount
    })
    return chartData
  }
}
const Handlebars = require('handlebars')

Handlebars.registerHelper('getIcon', function (category, options) {
  return category === '家居物業' ? `<i class="fas fa-home"></i>`
    : category === '交通出行' ? `<i class="fas fa-shuttle-van"></i>`
      : category === '休閒娛樂' ? `<i class="fas fa-grin-beam"></i>`
        : category === '餐飲食品' ? `<i class="fas fa-utensils"></i>`
          : `<i class="fas fa-pen"></i>`
})

Handlebars.registerHelper('isSelected', function (selectedOption, thisOption, options) {
  return (selectedOption === thisOption) ? 'selected' : ''
})

Handlebars.registerHelper('getDisplayDate', function (date, options) {
  const month = date.getMonth() === 11 ? 1 : date.getMonth() + 1
  return `${date.getFullYear()}/${month}/${date.getDate()}`
})

Handlebars.registerHelper('getInputDate', function (date, options) {
  if (!date) { return '' }
  const month = date.getMonth() === 11 ? 1 : date.getMonth() + 1
  return `${date.getFullYear()}-${month.toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
})
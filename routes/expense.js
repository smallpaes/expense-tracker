const express = require('express')
const router = express.Router()

// Include Controllers
const expenseController = require('../controllers/expense')

// Include check package from express-validator
const { body } = require('express-validator')
// Include authentication middleware
const isAuthenticated = require('../config/auth')

// Create new expense page
router.get('/new', isAuthenticated, expenseController.getNewExpense)

// Create new expanse submit
router.post('/new', isAuthenticated, [
  // name is requires
  body('name')
    .trim()
    .isLength({ min: 1, max: 8 })
    .withMessage('名字必填，且至多八個字！'),
  // date is require is in date format
  body('date')
    .isISO8601()
    .isAfter('2000-01-01')
    .isBefore('2030-01-01')
    .withMessage('日期未填或不在正常區間'),
  body('category')
    .custom(value => {
      if (!['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他'].includes(value)) {
        throw new Error('請選擇一個類別')
      }
      return true
    }),
  // amount is required, and should be a positive integer
  body('amount')
    .trim()
    .isInt({ min: 1, max: 99999 })
    .withMessage('必填一個小於十萬的金額！')
], expenseController.postNewExpense)

// Edit expense page
router.get('/edit/:id', isAuthenticated, expenseController.getEditExpense)

// Edit expense submit
router.put('/edit/:id', isAuthenticated, [
  // name is requires
  body('name')
    .trim()
    .isLength({ min: 1, max: 8 })
    .withMessage('名字必填，且至多八個字！'),
  // date is require is in date format
  body('date')
    .isISO8601()
    .isAfter('2000-01-01')
    .isBefore('2030-01-01')
    .withMessage('日期未填或不在正常區間'),
  body('category')
    .custom(value => {
      if (!['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他'].includes(value)) {
        throw new Error('請選擇一個類別')
      }
      return true
    }),
  // amount is required, and should be a positive integer
  body('amount')
    .trim()
    .isInt({ min: 1, max: 99999 })
    .withMessage('必填一個小於十萬的金額！')
], expenseController.postEditExpense)

// Delete expense 
router.delete('/delete/:id', isAuthenticated, expenseController.deleteExpense)


module.exports = router
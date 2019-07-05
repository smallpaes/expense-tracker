const express = require('express')
const router = express.Router()
// Include controllers
const searchController = require('../controllers/search')

// Include authentication middleware
const isAuthenticated = require('../config/auth')

router.get('/', isAuthenticated, searchController.getSearchExpense)

module.exports = router
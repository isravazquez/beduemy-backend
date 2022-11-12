const express = require('express')
const router = express.Router()

const authenticate = require('../middleware/authentication')

router.use('/course', require('./course'))
router.use('/purchase', require('./purchase'))
router.use('/review', require('./review'))
router.use('/role', require('./role'))
router.use('/user', require('./user'))

module.exports = router
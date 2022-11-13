const express = require('express')
const router = express.Router()

const authenticate = require('../middleware/authentication')


router.get('/', (req, res) => {
    res.json({ 'message': '¡Bienvenido a la API de Beduemy' })
});


router.use('/auth', require('./auth'))
router.use('/course', authenticate, require('./course'))
router.use('/purchase', authenticate, require('./purchase'))
router.use('/review', authenticate, require('./review'))
router.use('/role', authenticate, require('./role'))
router.use('/user', authenticate, require('./user'))

module.exports = router
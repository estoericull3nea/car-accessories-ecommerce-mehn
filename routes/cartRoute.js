const router = require('express').Router()

const { getCart } = require('../controllers/cartController')

router.route('/').get(getCart)

module.exports = router

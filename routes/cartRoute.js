const router = require('express').Router()

const { getCart } = require('../controllers/cartController')
const { usingMiddleware } = require('../controllers/userController')

router.use(usingMiddleware)
router.route('/').get(getCart)

module.exports = router

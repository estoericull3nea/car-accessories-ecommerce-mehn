const router = require('express').Router()

const checkout = require('../controllers/orderController')

const isAuth = require('../middlewares/isLoginMiddleware')

router.post('/checkout', checkout)

module.exports = router

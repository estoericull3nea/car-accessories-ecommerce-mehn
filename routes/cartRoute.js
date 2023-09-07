const router = require('express').Router()

const { getCart, deleteItemInCart } = require('../controllers/cartController')
const { usingMiddleware } = require('../controllers/userController')

router.use(usingMiddleware)
router.route('/').get(getCart)
router.route('/delete').post(deleteItemInCart)

module.exports = router

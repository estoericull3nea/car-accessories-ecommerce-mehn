const router = require('express').Router()

const {
  getCart,
  deleteItemInCart,
  addToCart,
} = require('../controllers/cartController')
const { usingMiddleware } = require('../controllers/userController')

router.use(usingMiddleware)
router.route('/').get(getCart).post(addToCart)
router.route('/delete').post(deleteItemInCart)

module.exports = router

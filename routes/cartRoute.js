const router = require('express').Router()

const {
  getCart,
  deleteItemInCart,
  addToCart,
} = require('../controllers/cartController')

router.route('/').get(getCart).post(addToCart)
router.route('/delete').post(deleteItemInCart)

module.exports = router

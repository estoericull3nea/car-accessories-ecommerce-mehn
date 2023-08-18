const router = require('express').Router()

const {
  getAllProducts,
  getProduct,
  addToCart,
} = require('../controllers/productController')

router.route('/').get(getAllProducts)
router.route('/').post(addToCart)
router.route('/:id').get(getProduct)

module.exports = router

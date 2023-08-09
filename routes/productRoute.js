const router = require('express').Router()

const {
  getAllProducts,
  getProduct,
} = require('../controllers/productController')

router.route('/').get(getAllProducts)
router.route('/:id').get(getProduct)

module.exports = router

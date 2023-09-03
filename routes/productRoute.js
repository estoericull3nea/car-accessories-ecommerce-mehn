const router = require('express').Router()

const {
  getAllProducts,
  getProduct,
} = require('../controllers/productController')

const { usingMiddleware } = require('../controllers/userController')

router.use(usingMiddleware)

router.route('/').get(getAllProducts)
router.route('/:id').get(getProduct)

module.exports = router

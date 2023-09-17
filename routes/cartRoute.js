const router = require('express').Router()

const {
  getCart,
  deleteItemInCart,
  addToCart,
} = require('../controllers/cartController')

const isAuth = require('../middlewares/isLoginMiddleware')

router.get('/', getCart)
router.post('/', isAuth, addToCart)
router.post('/delete', isAuth, deleteItemInCart)

module.exports = router

const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
  addToCart,
  usingMiddleware,
} = require('../controllers/userController')

router.use(usingMiddleware)

router.route('/login').get(getLogin).post(postLogin)
router.route('/register').get(getRegister).post(postRegister)

router.route('/').post(addToCart)

router.get('/logout', getLogout)

module.exports = router

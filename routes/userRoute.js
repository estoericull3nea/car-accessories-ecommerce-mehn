const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
  usingMiddleware,
  addBookmark,
} = require('../controllers/userController')

router.use(usingMiddleware)

router.route('/register').get(getRegister).post(postRegister)
router.route('/login').get(getLogin).post(postLogin)
router.route('/logout').get(getLogout)

// /auth/add-to-bookmark
router.route('/add-to-bookmark').post(addBookmark)

module.exports = router

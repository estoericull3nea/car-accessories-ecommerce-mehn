const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
  addBookmark,
} = require('../controllers/userController')

router.route('/register').get(getRegister).post(postRegister)
router.route('/login').get(getLogin).post(postLogin)
router.route('/logout').get(getLogout)
router.route('/add-to-bookmark').post(addBookmark)

module.exports = router

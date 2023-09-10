const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
} = require('../controllers/authController')
router.route('/register').get(getRegister).post(postRegister)
router.route('/login').get(getLogin).post(postLogin)
router.route('/logout').get(getLogout)

module.exports = router

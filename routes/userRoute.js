const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
} = require('../controllers/userController')

router.route('/login').get(getLogin).post(postLogin)
router.route('/register').get(getRegister).post(postRegister)

router.get('/logout', getLogout)

module.exports = router

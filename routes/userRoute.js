const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
} = require('../controllers/userController')

router.get('/login', getLogin)
router.get('/register', getRegister)

router.post('/register', postRegister)
router.post('/login', postLogin)
router.get('/logout', getLogout)

module.exports = router

const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  postLogout,
} = require('../controllers/authController')

router.get('/register', getRegister)
router.post('/register', postRegister)

router.get('/login', getLogin)
router.post('/login', postLogin)

router.post('/logout', postLogout)

module.exports = router

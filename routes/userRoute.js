const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  postLogout,
} = require('../controllers/userController')

router.get('/login', getLogin)
router.get('/register', getRegister)

router.post('/register', postRegister)
router.post('/login', postLogin)
router.post('/logout', postLogout)

module.exports = router

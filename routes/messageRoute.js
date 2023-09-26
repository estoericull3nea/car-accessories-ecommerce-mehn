const router = require('express').Router()

const postMessage = require('../controllers/messageController')
const isAuth = require('../middlewares/isLoginMiddleware')

router.post('/', isAuth, postMessage)

module.exports = router

const router = require('express').Router()

const postMessage = require('../controllers/messageController')

router.post('/', postMessage)

module.exports = router

const router = require('express').Router()

const { addBookmark, getProfile } = require('../controllers/userController')

router.route('/add-to-bookmark').post(addBookmark)
router.route('/profile').get(getProfile)

module.exports = router

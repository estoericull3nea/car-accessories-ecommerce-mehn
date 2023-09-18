const router = require('express').Router()
const path = require('path')

const {
  addBookmark,
  getProfile,
  editProfile,
  deleteProfile,
  deleteOneBookmark,
  deleteAccount,
  forgotPassword,
} = require('../controllers/userController')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, './pfps')
    cb(null, path.join(__dirname, '../public/listOfPfps'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const file_filter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  )
    cb(null, true)
  else return cb(null, false)
}

// image is uploading

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5mb
  },
  file_filter,
})

const isAuth = require('../middlewares/isLoginMiddleware')

router.get('/profile', isAuth, getProfile)
router.post('/add-to-bookmark', isAuth, addBookmark)
router.post('/edit-profile', upload.single('pfp'), isAuth, editProfile)
router.post('/delete-profile', deleteProfile)
router.post('/delete-bookmark', deleteOneBookmark)
router.post('/delete-account', deleteAccount)
router.post('/forgot-password', forgotPassword)

module.exports = router

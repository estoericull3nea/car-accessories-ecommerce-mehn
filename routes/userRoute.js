const router = require('express').Router()

const {
  addBookmark,
  getProfile,
  editProfile,
} = require('../controllers/userController')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './pfps')
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

router.route('/add-to-bookmark').post(addBookmark)
router.route('/profile').get(getProfile)

router.post('/edit-profile', upload.single('pfp'), editProfile)

module.exports = router

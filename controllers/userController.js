const notifier = require('node-notifier')
const Product = require('../models/product')
const UserModel = require('../models/user')

const addBookmark = async (req, res) => {
  try {
    req.user.addToBookmark(req.body.id).then(async () => {
      const product = await Product.findOne({ _id: req.body.id })

      notifier.notify({
        title: `Product ${product.title}!`,
        message: 'Added to bookmark!',
        wait: false,
      })
      res.redirect('/products')
    })
  } catch (error) {
    res.json(error.message)
  }
}

const getProfile = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('profile', {
      pageTitle: 'Profile',
      cartCount,
      user,
    })
  } else {
    res.render('profile', {
      pageTitle: 'Profile',
      cartCount: 0,
      user: null,
    })
  }
}

const editProfile = async (req, res) => {
  try {
    const { username, age, address, gender } = req.body
    const toBeUpdateOfUser = {}

    if (username) {
      toBeUpdateOfUser.username = username
    }

    if (age) {
      if (age < 0 || age > 300) toBeUpdateOfUser.age = 0
      else toBeUpdateOfUser.age = age
    }

    if (address) {
      toBeUpdateOfUser.address = address
    }

    if (gender) {
      toBeUpdateOfUser.gender = gender
    }

    let profileToBeUpdate = ''
    if (req.file) {
      profileToBeUpdate = '/listOfPfps/' + req.file.originalname
      toBeUpdateOfUser.pfp = profileToBeUpdate
    }

    if (req.user) {
      await req.user.addToListOfPfp(profileToBeUpdate)
      await UserModel.findByIdAndUpdate(req.user._id, toBeUpdateOfUser)

      return res.end('success')
    }
  } catch (error) {
    res.json(error.message)
  }
}

const deleteProfile = async (req, res) => {
  try {
    console.log(`delete`)
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  addBookmark,
  getProfile,
  editProfile,
  deleteProfile,
}

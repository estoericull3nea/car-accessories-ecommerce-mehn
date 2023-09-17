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
  console.log(req.file)
  console.log(req.body)
}

module.exports = {
  addBookmark,
  getProfile,
  editProfile,
}

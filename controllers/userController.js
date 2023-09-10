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
  const token = req.cookies['access_token'] // check token if generated
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('profile', {
      pageTitle: 'Profile',
      token,
      cartCount,
      user,
    })
  } else {
    res.render('profile', {
      pageTitle: 'Profile',
      token,
      cartCount: 0,
    })
  }
}

module.exports = {
  addBookmark,
  getProfile,
}

const UserModel = require('../models/user')
const Product = require('../models/product')

const notifier = require('node-notifier')

const getCart = async (req, res) => {
  try {
    const token = req.cookies['access_token']
    if (req.user) {
      const user = await UserModel.findById({ _id: req.user._id })
      const cartCount = user.cart.items.length

      // getting cart using populate
      const populateProductId = await user.populate('cart.items.productId')
      const populated = populateProductId.cart.items

      const allIdToRemove = []
      for (let i = 0; i < populateProductId.cart.items.length; i++) {
        allIdToRemove.push(populateProductId.cart.items[i].productId.id)
      }
      // console.log(`all id values are`)
      // console.log(allIdToRemove)

      res.render('cart', {
        pageTitle: 'Cart',
        token,
        cartCount,
        populated,
        allIdToRemove,
      })
    } else {
      res.render('cart', {
        pageTitle: 'Cart',
        token,
        populated: undefined,
        cartCount: 0,
        allIdToRemove: [],
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      req.flash('error_msg', 'Login first!')
      res.redirect('/auth/login')
    } else {
      const product = await Product.findOne({ _id: req.body.id })
      req.user
        .addToCart(req.body.id)
        .then(() => {
          notifier.notify({
            title: `Product ${product.title}!`,
            message: 'Added.',
            wait: false,
          })
          res.redirect('/products')
        })
        .catch((err) => console.log(err))
    }
  } catch (error) {
    res.json(error.message)
  }
}

const deleteItemInCart = async (req, res) => {
  const product = await Product.findOne({ _id: req.body.id })

  req.user
    .removeCart(req.body.id)
    .then(() => {
      notifier.notify({
        title: `Product ${product.title}!`,
        message: 'Removed!.',
        wait: false,
      })
      res.redirect('/cart')
    })
    .catch((err) => console.log(err))
}

module.exports = {
  getCart,
  deleteItemInCart,
  addToCart,
}

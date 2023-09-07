const UserModel = require('../models/user')

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

const deleteItemInCart = (req, res) => {
  req.user
    .removeCart(req.body.id)
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => console.log(err))
}

module.exports = {
  getCart,
  deleteItemInCart,
}

const UserModel = require('../models/User')

const getCart = async (req, res) => {
  try {
    const token = req.cookies['access_token']
    if (req.user) {
      const user = await UserModel.findById({ _id: req.user._id })
      const cartCount = user.cart.items.length

      // getting cart using populate
      const populateProductId = await user.populate('cart.items.productId')
      const populated = populateProductId.cart.items

      res.render('cart', { pageTitle: 'Cart', token, cartCount, populated })
    } else {
      res.render('cart', {
        pageTitle: 'Cart',
        token,
        populated: undefined,
        cartCount: 0,
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// const pDeleteItemCart = (req, res, _) => {
//   req.user
//     .removeCart(req.body.id)
//     .then(() => {
//       res.redirect('/cart')
//     })
//     .catch((err) => console.log(err))
// }

module.exports = {
  getCart,
}

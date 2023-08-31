const UserModel = require('../models/User')

const getCart = async (req, res) => {
  const token = req.cookies['access_token']
  if (req.session.user) {
    const user = await UserModel.findById({ _id: req.session.user._id })
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
}

module.exports = {
  getCart,
}

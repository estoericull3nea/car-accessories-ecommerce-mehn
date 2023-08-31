const UserModel = require('../models/User')

const getCart = async (req, res) => {
  console.log(req.session.user)

  const token = req.cookies['access_token']
  if (req.session.user) {
    const user = await UserModel.findById({ _id: req.session.user._id })
    const cartCount = user.cart.items.length

    res.render('cart', { pageTitle: 'Cart', token, cartCount })
  } else {
    res.render('cart', { pageTitle: 'Cart', token, cartCount: 0 })
  }
}

module.exports = {
  getCart,
}

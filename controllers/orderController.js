require('dotenv').config()
const User = require('../models/user')
const stripe = require('stripe')(process.env.SK_TEST)
const checkout = async (req, res) => {
  try {
    // const { address } = req.body
    // await User.findByIdAndUpdate(req.user.id, { address: address })
    // res.end('User address updated!')
    const storeItems = new Map([
      [1, { priceIncents: 10000, name: 'test1' }],
      [2, { priceIncents: 20000, name: 'test2' }],
    ])
    const session = await stripe.checkout.sessions.create({
      payment_method_types: 'card',
      mode: 'payment',
      line_items: req.body.id,
      price_data: {
        currency: 'usd',
        product_data: { name: 'Arabella' },
        unit_ammount: 500,
      },
      quantity: 2,

      success_url: '/',
      cancel_url: '/user/profile',
    })
    console.log(session.url)
  } catch (error) {
    res.json(error.message)
  }
}
module.exports = checkout

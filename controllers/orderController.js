const User = require('../models/user')
const checkout = async (req, res) => {
  try {
    const { address } = req.body
    await User.findByIdAndUpdate(req.user.id, { address: address })
    res.end('User address updated!')
  } catch (error) {
    res.json(error.message)
  }
}
module.exports = checkout

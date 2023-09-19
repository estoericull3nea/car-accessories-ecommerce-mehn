const User = require('../models/user')
const checkout = async (req, res) => {
  try {
    const { address } = req.body
    console.log(req.user.id)

    res.send(address)
  } catch (error) {
    res.json(error.message)
  }
}
module.exports = checkout

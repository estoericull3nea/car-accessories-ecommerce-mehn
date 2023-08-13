require('dotenv').config()

// getting sign and verify in jwt package
const { sign, verify } = require('jsonwebtoken')

// creating/generate token
const createToken = (user) => {
  const access_token = sign({ id: user.id }, process.env.ACCESS_TOKEN) // getting the id of user for for payload
  return access_token // returning token
}

// validataing token middleware
const validate_token = (req, res, next) => {
  const access_token = req.cookies['access_token'] // getting token from client
  if (!access_token) return res.redirect('auth/login') // checking token

  try {
    const valid_token = verify(access_token, process.env.ACCESS_TOKEN) // verifying token

    // if token is valid
    if (valid_token) {
      req.authenticated = true // set authenticated to true
      return next() // then next middleware
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createToken,
  validate_token,
}

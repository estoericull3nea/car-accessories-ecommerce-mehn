require('dotenv').config()

const { sign, verify } = require('jsonwebtoken')

const create_token = (user) => {
  const access_token = sign({ id: user.id }, process.env.ACCESS_TOKEN)
  return access_token
}

const validate_token = (req, res, next) => {
  const access_token = req.cookies['access_token']
  if (!access_token) return res.redirect('auth/login')

  try {
    const valid_token = verify(access_token, process.env.ACCESS_TOKEN)
    if (valid_token) {
      req.authenticated = true
      return next()
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  create_token,
  validate_token,
}

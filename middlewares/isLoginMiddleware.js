const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    req.flash('error_msg', 'Please login first.')
    res.redirect('/auth/login')
  }
}

module.exports = isAuth

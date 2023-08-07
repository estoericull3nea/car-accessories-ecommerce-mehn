const router = require('express').Router()

const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getProducts,
  getOurTeam,
  getFAQ,
  getTermsAndConditions,
  getPrivacyPolicy,
  getAboutUs,
  getHomepage,
  postContactUsForm,
  getProfile,
  postLogout,
} = require('../controllers/customer_controller')

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    res.redirect('login')
  }
}

// setting router
router.get('/', getHomepage)
router.get('/login', getLogin)
router.get('/register', getRegister)
router.post('/register', postRegister)
router.post('/login', postLogin)
router.get('/products', isAuth, getProducts)
router.get('/our-team', isAuth, getOurTeam)
router.get('/faq', isAuth, getFAQ)
router.get('/terms-and-conditions', isAuth, getTermsAndConditions)
router.get('/privacy-policy', isAuth, getPrivacyPolicy)
router.get('/about_us', isAuth, getAboutUs)
router.post('/contact-us', postContactUsForm)
router.get('/profile', isAuth, getProfile)
router.post('/logout', postLogout)

module.exports = router

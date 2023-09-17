const router = require('express').Router()

const {
  getOurTeam,
  getFAQ,
  getTermsAndConditions,
  getPrivacyPolicy,
  getAboutUs,
  getHomepage,
  postContactUsForm,
} = require('../controllers/indexController')

router.get('/', getHomepage)
router.get('/our-team', getOurTeam)
router.get('/faq', getFAQ)
router.get('/terms-and-conditions', getTermsAndConditions)
router.get('/privacy-policy', getPrivacyPolicy)
router.get('/about-us', getAboutUs)
router.post('/contact-us', postContactUsForm)

module.exports = router

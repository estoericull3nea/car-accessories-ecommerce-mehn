require('dotenv').config()

const nodemailer = require('nodemailer')

const UserModel = require('../models/user')

// getting
const getHomepage = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('homepage', {
      pageTitle: 'EA',
      cartCount,
      user,
    })
  } else {
    res.render('homepage', {
      pageTitle: 'EA',
      cartCount: 0,
      user: null,
    })
  }
}

const getOurTeam = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('team', { pageTitle: 'Our Team', cartCount, user })
  } else {
    res.render('team', { pageTitle: 'Our Team', cartCount: 0, user: null })
  }
}

const getFAQ = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('faq', { pageTitle: 'FAQ', cartCount, user })
  } else {
    res.render('faq', { pageTitle: 'FAQ', cartCount: 0, user: null })
  }
}

const getTermsAndConditions = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('terms', { pageTitle: 'Terms and Conditions', cartCount, user })
  } else {
    res.render('terms', {
      pageTitle: 'Terms and Conditions',
      cartCount: 0,
      user: null,
    })
  }
}

const getPrivacyPolicy = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('privacy', { pageTitle: 'Privacy Policy', cartCount, user })
  } else {
    res.render('privacy', {
      pageTitle: 'Privacy Policy',
      cartCount: 0,
      user: null,
    })
  }
}

const getAboutUs = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('about', { pageTitle: 'About Us', cartCount, user })
  } else {
    res.render('about', { pageTitle: 'About Us', cartCount: 0, user: null })
  }
}
// end of getting

module.exports = {
  getOurTeam,
  getFAQ,
  getTermsAndConditions,
  getPrivacyPolicy,
  getAboutUs,
  getHomepage,
}

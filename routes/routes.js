const router = require('express').Router()

const {
  gTempHomepage,
  gLogin,
  gRegister,
  pRegister,
  pLogin,
  usingMiddleware,
  pAddToCart,
  gCart,
  pDeleteItemCart,
  gProduct,
  gOurTeam,
  pCart,
  gFaq,
  gTermsnConditions,
  gPrivacyPolicy,
  gAboutUs,
  gHome,
  pConfirmation,
  pContactUsForm,
  gSearchItem,
  gProfile,
  pLogout,
  pPayment,
} = require('../controllers/customer_controller')

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    res.redirect('login')
  }
}

// setting router
router.get('/', gTempHomepage)
router.get('/login', gLogin)
router.get('/register', gRegister)
router.post('/register', pRegister)
router.post('/login', pLogin)
router.use(usingMiddleware)
router.post('/add-to-cart', pAddToCart)
router.get('/cart', isAuth, gCart)
router.post('/delete-item-cart', pDeleteItemCart)
router.get('/products', isAuth, gProduct)
router.get('/our-team', isAuth, gOurTeam)
router.post('/cart', pCart)
router.get('/faq', isAuth, gFaq)
router.get('/terms-and-conditions', isAuth, gTermsnConditions)
router.get('/privacy-policy', isAuth, gPrivacyPolicy)
router.get('/about_us', isAuth, gAboutUs)
router.get('/home', isAuth, gHome)
router.get('/confirmation/:tokenId', isAuth, pConfirmation)
router.post('/contact-us', pContactUsForm)
router.get('/products/search-item', isAuth, gSearchItem)
router.get('/profile', isAuth, gProfile)
router.post('/logout', pLogout)
router.post('/payment', pPayment)

// router.get("/verify", gVerify)

// router.get("/profile", (req, res) => {
//   req.user
//     .populate("cart.items.productId")
//     .then((user) => {
//       res.render("profile", {
//         cart: user.cart,
//         pageTitle: "Profile",
//       });
//     })
//     .catch((err) => console.log(err));
// });

// router.post("/delete-list", (req, res) => {
//   try {
//     Product.deleteOne({ _id: req.body.id }).then((result) => {
//       res.redirect("/home");
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });
module.exports = router
